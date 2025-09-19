import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethodProps {
  value: number; // 2: COD, 3: PayOS
  onChange: (value: number) => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div className="space-y-4 pt-4">
      <Label>Phương thức thanh toán</Label>
      <RadioGroup
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem value="2" id="cod" className="peer sr-only" />
          <Label
            htmlFor="cod"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <span className="font-medium">COD</span>
            <span className="text-sm text-muted-foreground">
              Thanh toán khi nhận hàng
            </span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="3" id="payos" className="peer sr-only" />
          <Label
            htmlFor="payos"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <span className="font-medium">PayOS</span>
            <span className="text-sm text-muted-foreground">
              Thanh toán online
            </span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}