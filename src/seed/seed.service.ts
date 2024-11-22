import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from '../team/entities/team.entity';
import { Player } from '../player/entities/player.entity';
import { Coach } from '../coach/entities/coach.entity';
import { teams } from './teams.json';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(Coach.name) private readonly coachModel: Model<Coach>,
  ) {}

  async seed() {
    if (process.env.ENABLE_SEEDING !== 'true') {
        console.log('Seeding is disabled');
        return;
    }

    const teamCount = await this.teamModel.countDocuments();
    if (teamCount > 0) {
        console.log('Teams already seeded');
        return;
    }

    console.log('Starting database seeding...');
    const positionMap = {
        "Defence": "defender",
        "Midfield": "midfielder",
        "Offence": "forward",
        "Goalkeeper": "goalkeeper"
    }
    for(const key in teams){
        const playerIds = []
        // Seed Team
        const createdTeam = await this.teamModel.create({
            name: teams[key].name,
            tla:  teams[key].tla,
            crest: teams[key].crest,
            establish: teams[key].founded,
            homeStadium: teams[key].venue,
        });
        // Seed Players
        if(teams[key].squad.length > 0){
            const bulkOperations = [];
            for(const player of teams[key].squad){
                bulkOperations.push({
                    insertOne: {
                        document: {
                            firstName: player.firstName || "firstName",
                            lastName: player.lastName || "lastName",
                            section: player.section,
                            position: positionMap[player.position],
                            nationality: player.nationality,
                            dateOfBirth: player.dateOfBirth,
                            shirtNumber: player.shirtNumber,
                            team: createdTeam._id, // Assign the new team ID to the player
                            joinedTeam: player.contract.start, // Update the joinedTeam field
                        },
                    },
                });
            };
            // Execute bulk operations
            const players = await this.playerModel.bulkWrite(bulkOperations);
            for(const key in players.insertedIds){
                playerIds.push(players.insertedIds[key])
            }
        }
        // Seed Coach
        const createdCoach = await this.coachModel.create({
            firstName: teams[key].coach.name.split(' ')[0],
            lastName: teams[key].coach.name.split(' ')[1],
            nationality: teams[key].coach.nationality,
            dateOfBirth: teams[key].coach.dateOfBirth,
            team: createdTeam._id,
            teamName: teams[key].name,
            crest: teams[key].crest,
            joinedTeam: teams[key].coach.contract.start
        });

        // Add id into team, players and coach
        await this.teamModel.findByIdAndUpdate(createdTeam._id,{
            coach: createdCoach._id,
            players: [...playerIds]
        });
    }
    console.log('Database seeding completed.');
  }

  async onModuleInit() {
    await this.seed();
  }
}