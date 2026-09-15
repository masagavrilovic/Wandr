import { customAlphabet } from 'nanoid';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';

const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 7);

export async function generateUniqueInviteCode(tripsRepository: Repository<Trip>): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const exists = await tripsRepository.findOneBy({ inviteCode: code });
    if (!exists) return code;
  }
  throw new Error('Failed to generate unique invite code after multiple attempts');
}