import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem as SelectItemOption,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectItemProps <T extends string> = {
  item: T;
  setItem: React.Dispatch<React.SetStateAction<T>>;
  items: T[];
}
export default function SelectItem<T extends string>({ item, setItem, items }: SelectItemProps<T>) {
 return (
      <Select onValueChange={(value: T) => setItem(value)} defaultValue={item}>
        <SelectTrigger className="w-[280px] text-gray-500">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent className="bg-backgroundSecondary text-textPrimary border-borderColor">
          <SelectGroup>
            {items.map((item) => (
                <SelectItemOption key={item} value={item}>
                    {item}
                </SelectItemOption>
                ))}
          </SelectGroup>
        </SelectContent>
      </Select>
  )
}
