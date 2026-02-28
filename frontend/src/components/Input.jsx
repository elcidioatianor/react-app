import { Description, Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'

export default function Example() {
  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-white">Name</Label>
        <Description className="text-sm/6 text-white/50">Use your real name so people will recognize you.</Description>
        <Input
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
          )}
        />
      </Field>
    </div>
  )
}
