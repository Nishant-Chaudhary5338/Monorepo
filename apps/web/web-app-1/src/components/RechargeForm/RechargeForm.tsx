import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui'

import { rechargeSchema, type RechargeSchema } from './recharge.schema'
import { CIRCLES, OPERATORS } from './recharge.mock'
import { getPlans, postRequirement } from './recharge.api'
import type { Plan } from './recharge.types'

export default function RechargeForm() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const form = useForm<RechargeSchema>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      category: 'prepaid',
      phoneNumber: '',
      operator: '',
      circle: '',
    },
  })

  const { watch } = form
  const operator = watch('operator')
  const circle = watch('circle')
  const category = watch('category')

  useEffect(() => {
    if (!operator || !circle || !category) {
      setPlans([])
      setSelectedPlanId(null)
      return
    }

    setPlansLoading(true)
    setSelectedPlanId(null)

    getPlans(operator, circle, category)
      .then(setPlans)
      .finally(() => setPlansLoading(false))
  }, [operator, circle, category])

  async function onSubmit(values: RechargeSchema) {
    setSubmitResult(null)
    const result = await postRequirement({ ...values, planId: selectedPlanId ?? undefined })
    setSubmitResult({ success: result.success, message: result.message ?? '' })
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-xl border bg-card shadow-sm">
      <h2 className="text-xl font-semibold mb-1">Mobile Recharge</h2>
      <p className="text-sm text-muted-foreground mb-6">Enter details to recharge your mobile number.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-6"
                  >
                    {(['prepaid', 'postpaid'] as const).map((cat) => (
                      <FormItem key={cat} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={cat} />
                        </FormControl>
                        <FormLabel className="font-normal capitalize cursor-pointer">{cat}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Operator + Circle (side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operator</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OPERATORS.map((op) => (
                        <SelectItem key={op.id} value={op.id}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="circle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Circle</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select circle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CIRCLES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Plans */}
          {plansLoading && (
            <p className="text-sm text-muted-foreground animate-pulse">Loading plans…</p>
          )}

          {!plansLoading && plans.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Plans</p>
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id === selectedPlanId ? null : plan.id)}
                    className={[
                      'text-left rounded-lg border px-4 py-3 text-sm transition-colors',
                      selectedPlanId === plan.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'hover:border-muted-foreground/50',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-base">₹{plan.price}</span>
                      <span className="text-muted-foreground">{plan.validity}</span>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Data: {plan.data}</span>
                      <span>Calls: {plan.calls}</span>
                      <span>SMS: {plan.sms}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Processing…' : 'Recharge Now'}
          </Button>

          {/* Result */}
          {submitResult && (
            <p
              className={[
                'text-sm text-center rounded-md px-3 py-2',
                submitResult.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-destructive/10 text-destructive border border-destructive/20',
              ].join(' ')}
            >
              {submitResult.message}
            </p>
          )}
        </form>
      </Form>
    </div>
  )
}
