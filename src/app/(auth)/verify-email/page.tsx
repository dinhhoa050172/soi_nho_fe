'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthRedux } from '@/hooks/useAuthRedux';
import Loading from '@/components/loading';

const EmailVerificationPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAuthRedux();
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const token = searchParams.get('token');

  const verifyEmail = async () => {

    if (token) {
      await dispatch.verifyEmail({ token })
        .then(() => {
          setStatus('success');
          setTimeout(() => router.push('/login'), 500);
        })
        .catch((err) => {
          setStatus('error');
          console.error('Email verification failed:', err);
          setTimeout(() => router.push('/login'), 500);
        });
    } else {
      setStatus('error');
      setTimeout(() => router.push('/login'), 500);
    }
    }
  useEffect(() => {

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {status === 'loading' && (
        <>
          <Loading />
        </>
      )}
    </div>
  );
};

export default EmailVerificationPage;
