'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone, Facebook, Instagram } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission (e.g., call API or show toast)
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">Liên Hệ Với Sợi Nhớ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form liên hệ */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email của bạn"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                placeholder="Lời nhắn của bạn..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white cursor-pointer">
                Gửi liên hệ
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Thông tin liên hệ */}
        <div className="space-y-4 text-gray-700 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="text-pink-600" />
            <div>
              <strong>Địa chỉ:</strong><br />
              123 Đường Handmade, Quận Len Tơ, TP. HCM
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="text-pink-600" />
            <div>
              <strong>Số điện thoại/Zalo:</strong><br />
              0901 234 567
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="text-pink-600" />
            <div>
              <strong>Email:</strong><br />
              soinhoshop@gmail.com
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Facebook className="text-pink-600" />
            <div>
              <a
                href="https://www.facebook.com/profile.php?id=61577079565393"
                target="_blank"
                className="hover:underline text-pink-700"
              >
                Facebook.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Instagram className="text-pink-600" />
            <div>
              <a
                href="https://instagram.com/soinho"
                target="_blank"
                className="hover:underline text-pink-700"
              >
                Instagram: @soinho
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
