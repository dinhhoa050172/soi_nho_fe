'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from 'next/link';
import { useAuthRedux } from '@/hooks/useAuthRedux';
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
} from '@/schemaValidations/auth.schema';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';


interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const dispatch = useAuthRedux();
  const appDispatch = useAppDispatch();

  const {
    register: formRegister,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(type === 'login' ? loginSchema : registerSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData | RegisterFormData> = async (data) => {
    try {
      if (type === 'register') {
        await dispatch.register(data as RegisterFormData);
      } else {
        const res = await dispatch.login(data as LoginFormData);
        await appDispatch(fetchUserProfile());
        const roleName = res.userProfile.roleName;
        router.push(roleName === 'Admin' ? '/dashboard' : '/');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Lỗi bị chặn trong quá trình xác thực';

      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto md:p-6 ">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {type === 'register' ? 'Đăng ký' : 'Đăng nhập'}
        </CardTitle>
      </CardHeader>

      <CardContent className=''>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {type === 'register' && (
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="firstName" className='mb-2'>Họ</Label>
                <Input id="firstName" {...formRegister('firstName')} />
                {'firstName' in errors && (
                  <p className="text-sm text-red-500 mt-1">{errors.firstName?.message}</p>
                )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="lastName" className='mb-2'>Tên</Label>
                <Input id="lastName" {...formRegister('lastName')} />
                {'lastName' in errors && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName?.message}</p>
                )}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email" className='mb-2'>Email</Label>
            <Input id="email" type="email" {...formRegister('email')} />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password" className='mb-2'>Mật khẩu</Label>
            <Input id="password" type="password" {...formRegister('password')} />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {type === 'register' && (
            <div>
              <Label htmlFor="phone" className='mb-2'>Số điện thoại</Label>
              <Input id="phone" {...formRegister('phone')} placeholder="+1234567890" />
              {'phone' in errors && (
                <p className="text-sm text-red-500 mt-1">{errors.phone?.message}</p>
              )}
            </div>
          )}

          {errors.root && (
            <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
          )}

          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting
              ? 'Đang xử lý...'
              : type === 'register'
                ? 'Đăng ký'
                : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-4 text-sm">
          {type === 'register' ? (
            <p>
              Bạn đã có tài khoản?{' '}
              <Link href="/login" className="text-primary underline font-bold">
                Đăng nhập
              </Link>
            </p>
          ) : (
            <>
              <p>
                Bạn chưa có tài khoản?{' '}
                <Link href="/register" className="text-primary underline font-bold">
                  Đăng ký
                </Link>
              </p>
              <ul className="mt-4 text-gray-600 space-y-1 text-left">
                <li>Khám phá niềm đam mê, sống đúng với bản chất cá nhân.</li>
                <li>Dấn thân vào hành trình, không ngừng phát triển.</li>
                <li>Tinh thần lạc quan, đặt mục tiêu và đạt được chúng.</li>
                <li>Tôi là người tạo ra câu chuyện của mình.</li>
              </ul>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
