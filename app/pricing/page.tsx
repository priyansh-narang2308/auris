"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@clerk/nextjs'
import { Check, Loader2, Sparkles, Crown, Shield } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { motion } from "framer-motion"

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        price: '9',
        priceId: 'price_1Swo47CDquGj0mAdsbY3Mi0c',
        monthlyPrice: 9,
        yearlyPrice: 90,
        monthlyPriceId: 'price_1Swo47CDquGj0mAdsbY3Mi0c',
        yearlyPriceId: 'price_1SworxCDquGj0mAdlEpb0nhI',
        description: 'Essential tools for individual productivity.',
        icon: Shield,
        features: [
            '10 meetings per month',
            '30 AI chat messages per day',
            'Basic meeting insights',
            'Email Notifications'
        ],
        popular: false
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '29',
        priceId: "price_1Swo47CDquGj0mAdlAymJitb",
        monthlyPrice: 29,
        yearlyPrice: 290,
        monthlyPriceId: "price_1Swo47CDquGj0mAdlAymJitb",
        yearlyPriceId: "price_1SwosFCDquGj0mAd2Y5v87BW",
        description: 'Advanced features for power users.',
        icon: Crown,
        features: [
            '30 meetings per month',
            '100 AI chat messages per day',
            'Advanced summaries',
            'Unlimited Search History',
            'Custom Meeting Templates',
            'Integration with Slack & Notion',
        ],
        popular: true
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '99',
        priceId: 'price_1Swo47CDquGj0mAdZSlPJ4bp',
        monthlyPrice: 99,
        yearlyPrice: 990,
        monthlyPriceId: 'price_1Swo47CDquGj0mAdZSlPJ4bp',
        yearlyPriceId: 'price_1SwosQCDquGj0mAdlCVHZrSX',
        description: 'Uncapped limits for teams and pros.',
        icon: Sparkles,
        features: [
            'Unlimited meetings',
            'Unlimited AI chat',
            'Highest accuracy model',
            '24/7 Priority Support'
        ],
        popular: false
    },
]

const PricingPage = () => {
    const { user } = useUser()
    const [loading, setLoading] = useState<string | null>(null)
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

    const handleSubscribe = async (priceId: string, planName: string) => {
        if (!user) return
        setLoading(priceId)

        try {
            const resp = await fetch("/api/stripe/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId, planName })
            })
            const data = await resp.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error(data.error || "Failed to create checkout session")
            }
        } catch (error) {
            console.log("Subscription error", error)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className='min-h-screen py-10 px-4 bg-background flex items-center justify-center font-sans overflow-hidden'>
            <div className='max-w-6xl mx-auto w-full'>

                <div className='text-center mb-4 space-y-4'>
                    <h2 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl'>
                        Transparent Pricing
                    </h2>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        Choose the plan that fits seamlessly into your workflow.
                    </p>
                </div>

                <div className="flex justify-center mb-14 relative">
                    <div className="flex items-center p-1 bg-muted rounded-full border border-border relative">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={cn(
                                "relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 w-32 cursor-pointer",
                                billingCycle === 'monthly' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Monthly
                            {billingCycle === 'monthly' && (
                                <motion.div
                                    layoutId="billing-pill"
                                    className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/50 -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={cn(
                                "relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 w-32 cursor-pointer",
                                billingCycle === 'yearly' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Yearly
                            {billingCycle === 'yearly' && (
                                <motion.div
                                    layoutId="billing-pill"
                                    className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/50 -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>

                </div>


                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center'>
                    {plans.map((plan) => {
                        const isYearly = billingCycle === 'yearly'
                        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
                        const priceId = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId

                        const isLoading = loading === priceId
                        const Icon = plan.icon

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    "flex flex-col relative transition-all duration-300",
                                    plan.popular
                                        ? "border-orange-500 shadow-2xl shadow-orange-500/10 md:scale-110 z-10 md:h-[540px] h-auto bg-background"
                                        : "border-border hover:border-primary/20 md:h-[480px] h-auto bg-card"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 text-sm font-semibold shadow-md">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <div className={cn(
                                                "p-2 rounded-lg",
                                                plan.popular ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            {plan.name}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-sm min-h-[40px] text-muted-foreground">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <div className="px-6 mb-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold tracking-tight text-foreground">${price}</span>
                                        <span className="text-muted-foreground font-medium">/{isYearly ? 'yr' : 'mo'}</span>
                                    </div>
                                    {isYearly && (
                                        <p className="text-xs text-orange-600 font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                                            Save ${(plan.monthlyPrice! * 12) - plan.yearlyPrice!} a year
                                        </p>
                                    )}
                                </div>

                                <CardContent className="flex-1 pt-0">
                                    <Separator className="mb-6" />
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                <Check className={cn(
                                                    "w-4 h-4 shrink-0 mt-0.5",
                                                    plan.popular ? "text-orange-500" : "text-primary"
                                                )} />
                                                <span className="leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="pt-4">
                                    <Button
                                        onClick={() => handleSubscribe(priceId!, plan.name)}
                                        disabled={isLoading}
                                        className={cn(
                                            "w-full h-11 font-bold text-base transition-all duration-300 cursor-pointer shadow-md active:scale-[0.98]",
                                            plan.popular
                                                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 border-b-4 border-orange-700 hover:border-b-2 hover:mt-[2px]"
                                                : "shadow-sm"
                                        )}
                                        variant={plan.popular ? "default" : "outline"}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className='w-4 h-4 animate-spin' />
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            plan.popular ? `Get Started` : `Choose ${plan.name}`
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PricingPage