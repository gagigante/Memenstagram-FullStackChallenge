import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import RedefineUserPasswordService from './RedefineUserPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let redefineUserPasswordService: RedefineUserPasswordService;

describe('RedefineUserPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    redefineUserPasswordService = new RedefineUserPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to redefine password', async () => {
    const user = fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'johndoe',
      email: 'johndoe@example.com',
      phone_number: '+5511123456789',
      password: '123456',
      confirmation_code: '123456',
    });

    user.is_reseted = true;
    user.confirmation_status = true;

    const response = await redefineUserPasswordService.execute({
      userId: user.id,
      password: '654321',
      oldPassword: user.password,
    });

    expect(response).toEqual(classToClass(user));
  });

  it('Should not be able to redefine password of a non existing user', async () => {
    await expect(
      redefineUserPasswordService.execute({
        userId: 'non-existing-user',
        password: '123456',
        oldPassword: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to redefine password of a non verified account', async () => {
    const user = fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'johndoe',
      email: 'johndoe@example.com',
      phone_number: '+5511123456789',
      password: '123456',
      confirmation_code: '123456',
    });

    await expect(
      redefineUserPasswordService.execute({
        userId: user.id,
        password: '654321',
        oldPassword: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to redefine password of non reseted account', async () => {
    const user = fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'johndoe',
      email: 'johndoe@example.com',
      phone_number: '+5511123456789',
      password: '123456',
      confirmation_code: '123456',
    });

    user.confirmation_status = true;

    await expect(
      redefineUserPasswordService.execute({
        userId: user.id,
        password: '654321',
        oldPassword: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to redefine password with incorrect current password', async () => {
    const user = fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'johndoe',
      email: 'johndoe@example.com',
      phone_number: '+5511123456789',
      password: '123456',
      confirmation_code: '123456',
    });

    user.is_reseted = true;
    user.confirmation_status = true;

    await expect(
      redefineUserPasswordService.execute({
        userId: user.id,
        password: '654321',
        oldPassword: 'incorrect-current-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
