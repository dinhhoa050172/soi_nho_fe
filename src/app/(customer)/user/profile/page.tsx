"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "@/store/slices/userSlice";
import { RootState, AppDispatch } from "@/store/store";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-2 sm:py-10 sm:px-4">
        <div className="space-y-8">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Card className="p-4 sm:p-6 shadow-sm rounded-xl">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-shrink-0 flex justify-center">
                <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full" />
              </div>
              <div className="flex-grow space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-2 sm:py-10 sm:px-4">
        <Card className="p-4 sm:p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-4 text-red-500">
            <AlertCircle className="h-12 w-12" />
            <h2 className="text-xl font-semibold">Đã xảy ra lỗi</h2>
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={() => dispatch(fetchUserProfile())}
            >
              Thử lại
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-2 sm:py-10 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Hồ sơ cá nhân
        </h1>
        <Button variant="outline" className="gap-2 cursor-pointer">
          <Edit className="h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>

      {user ? (
        <Card className="p-4 sm:p-8 shadow-sm rounded-xl border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <User className="h-14 w-14 sm:h-20 sm:w-20 text-pink-500" />
                </div>
                <div className="absolute -bottom-2 right-0 bg-white p-2 rounded-full shadow-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer hover:bg-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-grow w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 gap-y-8 min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">Họ và tên</span>
                  </div>
                  <p className="text-base sm:text-lg font-medium pl-7">
                    {user.firstName || ""} {user.lastName || "Chưa cập nhật"}
                  </p>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-base sm:text-lg font-medium pl-7 break-words">
                    {user.email}
                  </p>
                  <div className="pl-7 mt-1">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Đã xác thực
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-sm text-amber-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Chưa xác thực
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="h-5 w-5" />
                    <span className="text-sm font-medium">Số điện thoại</span>
                  </div>
                  <p className="text-base sm:text-lg font-medium pl-7">
                    {user.phone || "Chưa cập nhật"}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm font-medium">Ngày tham gia</span>
                  </div>
                  <p className="text-base sm:text-lg font-medium pl-7">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 sm:p-6 text-center">
          <p className="text-gray-500">Không tìm thấy thông tin người dùng</p>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
