import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ISMSProvider from '@shared/containers/providers/SMSProvider/models/ISMSProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  userId: string;
}

@injectable()
class SendActivationCodeSmsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('SMSProvider')
    private smsProvider: ISMSProvider,
  ) {}

  public async execute({ userId }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User was not found.');
    }

    return this.smsProvider.sendSMS({
      phoneNumber: user.phone_number,
      message: `Your verification code is ${user.confirmation_code}`,
    });
  }
}

export default SendActivationCodeSmsService;
