import AppError from '@shared/errors/AppError';

import FakeSMSProvider from '@shared/containers/providers/SMSProvider/fakes/FakeSMSProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeSMSProvider: FakeSMSProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeSMSProvider = new FakeSMSProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeSMSProvider,
    );
  });

  it('Should be able to reset password', async () => {
    const sendSMS = jest.spyOn(fakeSMSProvider, 'sendSMS');

    const user = fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'johndoe',
      email: 'johndoe@example.com',
      phone_number: '+5511123456789',
      password: '123456',
      confirmation_code: '123456',
    });

    await resetPasswordService.execute({ phoneNumber: user.phone_number });

    expect(sendSMS).toHaveBeenCalled();
  });

  it('Should not be able to reset password of a non existing account', async () => {
    await expect(
      resetPasswordService.execute({ phoneNumber: '+5511123456789' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
