"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import AddressList from "@/app/(main)/checkout/components/AddressList";
import AddressForm from "@/app/(main)/checkout/components/AddressForm";
import PaymentMethod from "@/app/(main)/checkout/components/PaymentMethod";
import OrderSummary from "@/app/(main)/checkout/components/OrderSummary";
import { Address, Province, District, Ward } from "@/types/address";
import { Button } from "@/components/ui/button";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { CartItem, clearCartApi, fetchCart } from "@/store/slices/cartSlice";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const PROVINCE_API_URL = "https://provinces.open-api.vn/api/p/";

export default function CheckoutPage() {
  // State management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({
    fullName: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    province: "",
    country: "Việt Nam",
    postalCode: "",
    isDefault: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<number>(2);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingFee, setShippingFee] = useState(20000);
  const [isDeleting, setIsDeleting] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);

  // Redux and router
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items || []);
  const user = useAppSelector((state) => state.user.user);
  const cartId = useAppSelector((state) => state.cart.cartId);
  const searchParams = useSearchParams();

  // Buy now params
  const isBuyNow = searchParams?.get("buyNow") === "1";
  const productId = searchParams?.get("productId");
  const quantity = Number(searchParams?.get("quantity")) || 1;

  // Fetch addresses
  const getAddress = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/address`);
      if (!res.ok) throw new Error("Failed to fetch addresses");
      
      const data = await res.json();
      const sortedAddresses = (data.data || []).sort(
        (a: Address, b: Address) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
      );
      
      setAddresses(sortedAddresses);
      setSelectedAddress(sortedAddresses.find((addr: Address) => addr.isDefault) || sortedAddresses[0] || null);
    } catch (error) {
      console.error("Address fetch error:", error);
      toast.error("Không thể tải địa chỉ giao hàng. Vui lòng thử lại sau.");
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch product for buy now
  const fetchProduct = useCallback(async () => {
    if (!isBuyNow || !productId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      
      const data = await res.json();
      setBuyNowProduct(data);
    } catch (err) {
      console.error("Buy now product fetch error:", err);
      toast.error("Không thể tải sản phẩm 'Mua ngay'");
    }
  }, [isBuyNow, productId]);

  // Initialize component
  useEffect(() => {
    getAddress();
    fetchProduct();

    // Only use localStorage shipping method if not buy now
  if (!isBuyNow) {
    const method = localStorage.getItem("shippingMethod");
    setShippingFee(method === "store" ? 0 : 20000);
  } else {
    // For buy now, always use 20000 shipping fee
    setShippingFee(20000);
  }
}, [getAddress, fetchProduct, isBuyNow]);

  // Address management
  const resetAddressForm = useCallback(() => {
    setCurrentAddress({
      fullName: "",
      phone: "",
      street: "",
      ward: "",
      district: "",
      province: "",
      country: "Việt Nam",
      postalCode: "",
      isDefault: true,
    });
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setShowAddressForm(false);
    setIsEditing(false);
  }, []);

  const handleAddNewAddress = useCallback(async () => {
    setIsEditing(false);
    resetAddressForm();
    
    if (provinces.length === 0) {
      try {
        const provincesData = await fetch(PROVINCE_API_URL).then(res => res.json());
        setProvinces(provincesData);
      } catch (error) {
        console.error("Province fetch error:", error);
        toast.error("Không thể tải danh sách tỉnh/thành");
      }
    }
    
    setShowAddressForm(true);
  }, [provinces.length, resetAddressForm]);

  const handleEditAddress = useCallback(async (address: Address) => {
    setIsEditing(true);
    setCurrentAddress(address);
    
    try {
      if (provinces.length === 0) {
        const provincesData = await fetch(PROVINCE_API_URL).then(res => res.json());
        setProvinces(provincesData);
      }

      const province = provinces.find(p => p.name === address.province);
      if (!province) return;

      setSelectedProvince(String(province.code));
      const districtsData = await fetch(
        `${PROVINCE_API_URL}${province.code}?depth=2`
      ).then(res => res.json());
      
      setDistricts(districtsData.districts || []);
      const district = districtsData.districts.find(
        (d: District) => d.name === address.district
      );
      
      if (district) {
        setSelectedDistrict(String(district.code));
        const wardsData = await fetch(
          `https://provinces.open-api.vn/api/d/${district.code}?depth=2`
        ).then(res => res.json());
        
        setWards(wardsData.wards || []);
        const ward = wardsData.wards.find((w: Ward) => w.name === address.ward);
        if (ward) setSelectedWard(String(ward.code));
      }
    } catch (error) {
      console.error("Address edit error:", error);
      toast.error("Không thể tải thông tin địa chỉ");
    }
    
    setShowAddressForm(true);
  }, [provinces]);

  // Location handlers
  const handleProvinceChange = useCallback(async (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setSelectedWard("");
    
    const province = provinces.find(p => String(p.code) === provinceCode);
    if (!province) return;

    setCurrentAddress(prev => ({
      ...prev,
      province: province.name,
      district: "",
      ward: "",
    }));

    try {
      const districtsData = await fetch(
        `${PROVINCE_API_URL}${province.code}?depth=2`
      ).then(res => res.json());
      
      setDistricts(districtsData.districts || []);
      setWards([]);
    } catch (error) {
      console.error("District fetch error:", error);
      toast.error("Không thể tải danh sách quận/huyện");
    }
  }, [provinces]);

  const handleDistrictChange = useCallback(async (districtCode: string) => {
    setSelectedDistrict(districtCode);
    setSelectedWard("");
    
    const district = districts.find(d => String(d.code) === districtCode);
    if (!district) return;

    setCurrentAddress(prev => ({
      ...prev,
      district: district.name,
      ward: "",
    }));

    try {
      const wardsData = await fetch(
        `https://provinces.open-api.vn/api/d/${district.code}?depth=2`
      ).then(res => res.json());
      
      setWards(wardsData.wards || []);
    } catch (error) {
      console.error("Ward fetch error:", error);
      toast.error("Không thể tải danh sách phường/xã");
    }
  }, [districts]);

  const handleWardChange = useCallback((wardCode: string) => {
    setSelectedWard(wardCode);
    const ward = wards.find(w => String(w.code) === wardCode);
    if (ward) {
      setCurrentAddress(prev => ({ ...prev, ward: ward.name }));
    }
  }, [wards]);

  // Address submission
  const handleSubmitAddress = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!currentAddress.fullName || !currentAddress.phone || !currentAddress.street) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc (Họ tên, SĐT, Địa chỉ)");
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(currentAddress.phone!)) {
      toast.error("Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số");
      return;
    }

    if (currentAddress.postalCode && !/^\d{5,6}$/.test(currentAddress.postalCode)) {
      toast.error("Mã bưu chính phải có 5-6 chữ số");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get location names from codes
      let provinceName = currentAddress.province;
      let districtName = currentAddress.district;
      let wardName = currentAddress.ward;

      if (selectedProvince) {
        const province = provinces.find(p => String(p.code) === selectedProvince);
        if (province) provinceName = province.name;
      }

      if (selectedDistrict) {
        const district = districts.find(d => String(d.code) === selectedDistrict);
        if (district) districtName = district.name;
      }

      if (selectedWard) {
        const ward = wards.find(w => String(w.code) === selectedWard);
        if (ward) wardName = ward.name;
      }

      if (!provinceName || !districtName || !wardName) {
        toast.error("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã");
        return;
      }

      const addressData = {
        fullName: currentAddress.fullName,
        phone: currentAddress.phone,
        street: currentAddress.street,
        ward: wardName,
        district: districtName,
        province: provinceName,
        country: currentAddress.country || "Việt Nam",
        postalCode: currentAddress.postalCode || "",
        isDefault: currentAddress.isDefault || false,
      };

      const url = isEditing && currentAddress.id
        ? `/api/address/${currentAddress.id}`
        : "/api/address";
      
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi gửi dữ liệu");
      }

      toast.success(
        isEditing 
          ? "Cập nhật địa chỉ thành công!" 
          : "Thêm địa chỉ mới thành công!"
      );
      
      await getAddress();
      if (addressData.isDefault) {
        const updatedAddresses = await fetch("/api/address").then(res => res.json());
        const defaultAddress = updatedAddresses.data.find(
          (addr: Address) => addr.isDefault
        );
        setSelectedAddress(defaultAddress || null);
      }
      
      setShowAddressForm(false);
      setShowAddressModal(false);
      resetAddressForm();
    } catch (error) {
      console.error("Address submission error:", error);
      toast.error(
        isEditing
          ? "Cập nhật địa chỉ thất bại. Vui lòng thử lại!"
          : "Thêm địa chỉ mới thất bại. Vui lòng thử lại!"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentAddress,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    provinces,
    districts,
    wards,
    isEditing,
    getAddress,
    resetAddressForm
  ]);

  // Address deletion
  const handleDeleteAddress = useCallback(async (addressId: string) => {
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/address/${addressId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Xóa thất bại");
      
      toast.success("Đã xóa địa chỉ");
      await getAddress();
      
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(addresses[0] || null);
      }
    } catch (error) {
      console.error("Address deletion error:", error);
      toast.error("Không thể xóa địa chỉ");
    } finally {
      setIsDeleting(false);
    }
  }, [addresses, getAddress, selectedAddress]);

  // Calculate order totals
  const cartItemsToRender: CartItem[] = isBuyNow && buyNowProduct
    ? [{
        productId: buyNowProduct.id,
        productName: buyNowProduct.name,
        productImageUrl: buyNowProduct.productImages?.[0]?.url,
        price: Number(buyNowProduct.price),
        quantity: quantity,
      }]
    : cartItems;

  const subtotal = cartItemsToRender.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const total = subtotal + shippingFee;

  // Order submission
  const handleSubmitOrder = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    if (cartItems.length === 0 && !isBuyNow) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    try {
      // 1. Create order
      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress.id,
          totalAmount: total,
          paymentMethodId: paymentMethod,
        }),
      });

      if (!orderRes.ok) throw new Error("Tạo đơn hàng thất bại");

      const orderData = await orderRes.json();
      const orderId = orderData.id || orderData.data?.id;
      const payUrl = orderData.payment?.payUrl || orderData.data?.payment?.payUrl;

      // 2. Add order items
      const itemsToProcess = isBuyNow && buyNowProduct
        ? [{
            productId: buyNowProduct.id,
            price: Number(buyNowProduct.price),
            quantity: quantity,
          }]
        : cartItems;

      for (const item of itemsToProcess) {
        const itemRes = await fetch("/api/order/order-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: item.price * item.quantity,
            unitPrice: item.price,
            quantity: item.quantity,
            orderId,
            productId: item.productId,
          }),
        });

        if (!itemRes.ok) throw new Error("Thêm sản phẩm vào đơn hàng thất bại");
      }

      // 3. Clear cart if not buy now
      if (!isBuyNow && cartId && user?.id) {
        await dispatch(clearCartApi({ cartId }));
        await dispatch(fetchCart(user.id));
      }

      // 4. Redirect to payment or show success
      if (payUrl) {
        toast.success("Đặt hàng thành công! Đang chuyển đến cổng thanh toán...");
        setBuyNowProduct(null);
        window.location.href = payUrl;
      } else {
        toast.success("Đặt hàng thành công!");
        setBuyNowProduct(null);
      }
    } catch (error: unknown) {
      console.error("Order submission error:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Có lỗi khi đặt hàng"
      );
    }
  }, [
    selectedAddress,
    cartItems,
    isBuyNow,
    buyNowProduct,
    quantity,
    total,
    paymentMethod,
    cartId,
    user?.id,
    dispatch
  ]);

  // Helper components
  const renderDeleteButton = (addressId: string) => (
    <ConfirmDeleteModal
      trigger={
        <Button variant="outline" className="flex-1 cursor-pointer">
          Xóa
        </Button>
      }
      onConfirm={() => handleDeleteAddress(addressId)}
      isLoading={isDeleting}
      itemName="địa chỉ này"
    />
  );

  const handleAddressFormChange = useCallback(
    (field: keyof Address, value: Address[keyof Address]) => {
      setCurrentAddress(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-pink-600">
        Thanh Toán
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping and payment info */}
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-6 shadow-md rounded-2xl">
          {/* Address card */}
          <div className="bg-white p-3 rounded-lg">
            <h2 className="font-bold text-lg mb-4">Địa chỉ giao hàng</h2>
            <div className="flex items-center justify-between">
              {selectedAddress ? (
                <div>
                  <div className="font-semibold">{selectedAddress.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    SĐT: {selectedAddress.phone}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Địa chỉ: {selectedAddress.street}, {selectedAddress.ward},{" "}
                    {selectedAddress.district}, {selectedAddress.province},{" "}
                    {selectedAddress.country}
                  </div>
                  {selectedAddress.postalCode && (
                    <div className="text-sm text-muted-foreground">
                      Mã bưu chính: {selectedAddress.postalCode}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ nhận hàng
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setShowAddressModal(true)}
              >
                Đổi địa chỉ
              </Button>
            </div>
          </div>

          {/* Payment method card */}
          <div className="bg-white p-3 rounded-lg">
            <PaymentMethod
              value={paymentMethod}
              onChange={(value: number) => setPaymentMethod(value)}
            />
          </div>

          {/* Address selection modal */}
          {showAddressModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <AddressList
                addresses={addresses}
                selectedAddress={selectedAddress}
                onSelect={(addr) => {
                  setSelectedAddress(addr);
                  setShowAddressModal(false);
                }}
                onEdit={handleEditAddress}
                renderDeleteButton={renderDeleteButton}
                onAddNew={handleAddNewAddress}
                onClose={() => setShowAddressModal(false)}
              />
            </div>
          )}

          {/* Address form */}
          {showAddressForm && (
            <AddressForm
              currentAddress={currentAddress}
              provinces={provinces}
              districts={districts}
              wards={wards}
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              selectedWard={selectedWard}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              onChange={handleAddressFormChange}
              onProvinceChange={handleProvinceChange}
              onDistrictChange={handleDistrictChange}
              onWardChange={handleWardChange}
              onSubmit={handleSubmitAddress}
              onCancel={resetAddressForm}
            />
          )}
        </div>

        {/* Order summary */}
        <OrderSummary
          cartItems={cartItemsToRender}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
          onOrder={handleSubmitOrder}
        />
      </div>
    </div>
  );
}