// ❌ MESSY TYPESCRIPT FILE — has TypeScript but violates best practices
// This file is used to demo the typescript-enforcer / scan_file tool

import React, { useState, useRef, useCallback } from 'react'

// ❌ no-any: using 'any' everywhere instead of proper types
interface MessyProps {
  data: any                    // should be a typed interface
  onSubmit: (value: any) => any  // should be typed callbacks
  config: any                  // should be typed
  extraStuff: any              // should be Record<string, unknown>
}

// ❌ modifiers: props interface has no 'readonly'
// should be: readonly data: SomeType

// ❌ utility-types: manual union instead of using Pick/Omit/Partial
type UpdateProps = {
  data: any
  onSubmit: (value: any) => any
  // could be Pick<MessyProps, 'data' | 'onSubmit'>
}

function MessyComponent(props: MessyProps) {
  // ❌ no-any: state typed as any
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<any[]>([])
  const [cache, setCache] = useState<Map<any, any>>(new Map())

  // ❌ generics: useRef missing generic type param
  const inputRef = useRef(null)  // should be useRef<HTMLInputElement>(null)
  const timerRef = useRef(null)  // should be useRef<ReturnType<typeof setTimeout>>(null)

  // ❌ type-guards: using 'as' cast instead of a type guard function
  function processItem(item: any) {
    const typed = item as { id: number; name: string; value: any }
    return typed.name
  }

  // should be:
  // function isTypedItem(item: unknown): item is { id: number; name: string; value: string } {
  //   return typeof item === 'object' && item !== null && 'id' in item
  // }

  // ❌ modifiers: this function should use 'const' assertion on its return
  function getDefaults() {
    return {
      theme: 'light',
      size: 'medium',
      variant: 'primary'
    }
    // should be: return { ... } as const
  }

  // ❌ no-any: callback with any types
  const handleChange = useCallback((e: any) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }, [])

  // ❌ no-any: no proper error typing
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await props.onSubmit(formData)
    } catch (err: any) {
      // should be: catch (err: unknown) { if (err instanceof Error) { ... } }
      setErrors([...errors, err.message])
    }
  }

  // ❌ no-any: mapping over untyped data
  const renderItems = () => {
    if (!props.data?.items) return null
    return props.data.items.map((item: any, index: any) => (
      <div key={index}>
        <span>{item.label}</span>
        <span>{item.value}</span>
      </div>
    ))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          ref={inputRef}
          onChange={handleChange}
          placeholder="Enter value"
        />
      </div>
      {renderItems()}
      <button type="submit">Submit</button>
      {errors.length > 0 && (
        <div>
          {errors.map((err: any, i: any) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
    </form>
  )
}

export default MessyComponent
