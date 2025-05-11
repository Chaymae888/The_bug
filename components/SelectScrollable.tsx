import * as React from "react"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Tag {
  value: string
  label: string
}

export function SelectScrollable() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])

  const handleSelect = (value: string) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems([...selectedItems, value])
    }
  }

  const removeItem = (value: string) => {
    setSelectedItems(selectedItems.filter(item => item !== value))
  }

  const tags: Tag[] = [
    { value: "ajax", label: ".ajax" },
    { value: "app", label: ".app" },
    { value: "avi", label: ".avi" },
    { value: "bash-profile", label: ".bash-profile" },
    { value: "bashrc", label: ".bashrc" },
    { value: "class-file", label: ".class-file" },
    { value: "cod-file", label: ".cod-file" },
    { value: "csproj.in", label: ".csproj.in" },
    { value: "ctf", label: ".ctf" },
    { value: "d.ts", label: ".d.ts" },
    { value: "doc", label: ".doc" },
    { value: "emf", label: ".emf" },
    { value: "env", label: ".env" },
  ]

  const getTagLabel = (value: string): string => {
    const foundTag = tags.find(tag => tag.value === value)
    return foundTag ? foundTag.label : value
  }

  return (
    <div className="space-y-2">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-[280px] text-gray-500">
          <SelectValue placeholder="Select at least one tag" />
        </SelectTrigger>
        <SelectContent className="bg-backgroundSecondary text-textPrimary border-borderColor">
          <SelectGroup>
            <SelectLabel>A</SelectLabel>
            <SelectItem value="ajax">.ajax</SelectItem>
            <SelectItem value="app">.app</SelectItem>
            <SelectItem value="avi">.avi</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>B</SelectLabel>
            <SelectItem value="bash-profile">.bash-profile</SelectItem>
            <SelectItem value="bashrc">.bashrc</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>C</SelectLabel>
            <SelectItem value="class-file">.class-file</SelectItem>
            <SelectItem value="cod-file">.cod-file</SelectItem>
            <SelectItem value="csproj.in">.csproj.in</SelectItem>
            <SelectItem value="ctf">.ctf</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>D</SelectLabel>
            <SelectItem value="d.ts">.d.ts</SelectItem>
            <SelectItem value="doc">.doc</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>E</SelectLabel>
            <SelectItem value="emf">.emf</SelectItem>
            <SelectItem value="env">.env</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map(item => (
            <div
              key={item}
              className="flex items-center gap-1 bg-textSecondary text-textPrimary px-2 py-1 rounded-md"
            >
              <span>{getTagLabel(item)}</span>
              <button
                onClick={() => removeItem(item)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}