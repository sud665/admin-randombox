import { create } from 'zustand'
import type { Product } from '@/types'

interface FeverState {
  currentAmount: number
  targetAmount: number
  percentage: number
  isActive: boolean
  rewardProduct: Product | null
  isSimulating: boolean
  isFeverTriggered: boolean
  startSimulation: () => void
  stopSimulation: () => void
  addAmount: (amount: number) => void
  reset: () => void
  triggerFever: () => void
  setInitial: (data: { currentAmount: number; targetAmount: number; percentage: number; isActive: boolean; rewardProduct: Product | null }) => void
  dismissFever: () => void
}

let simulationTimer: ReturnType<typeof setInterval> | null = null

export const useFeverStore = create<FeverState>()((set, get) => ({
  currentAmount: 0,
  targetAmount: 5000000,
  percentage: 0,
  isActive: true,
  rewardProduct: null,
  isSimulating: false,
  isFeverTriggered: false,

  setInitial: (data) => {
    set({
      currentAmount: data.currentAmount,
      targetAmount: data.targetAmount,
      percentage: data.percentage,
      isActive: data.isActive,
      rewardProduct: data.rewardProduct,
    })
  },

  addAmount: (amount: number) => {
    const { currentAmount, targetAmount } = get()
    const newAmount = Math.min(currentAmount + amount, targetAmount)
    const newPercentage = (newAmount / targetAmount) * 100

    set({
      currentAmount: newAmount,
      percentage: newPercentage,
    })

    if (newPercentage >= 100) {
      get().triggerFever()
    }
  },

  startSimulation: () => {
    if (simulationTimer) return
    set({ isSimulating: true })

    const tick = () => {
      const delay = 2000 + Math.random() * 3000 // 2~5초
      simulationTimer = setTimeout(() => {
        const { percentage, isSimulating } = get()
        if (!isSimulating || percentage >= 100) {
          get().stopSimulation()
          return
        }
        const randomAmount = Math.floor(50000 + Math.random() * 200000) // 5만 ~ 25만
        get().addAmount(randomAmount)
        tick()
      }, delay) as unknown as ReturnType<typeof setInterval>
    }
    tick()
  },

  stopSimulation: () => {
    if (simulationTimer) {
      clearTimeout(simulationTimer as unknown as number)
      simulationTimer = null
    }
    set({ isSimulating: false })
  },

  triggerFever: () => {
    get().stopSimulation()
    set({ isFeverTriggered: true })
  },

  dismissFever: () => {
    set({ isFeverTriggered: false })
  },

  reset: () => {
    get().stopSimulation()
    set({
      currentAmount: 0,
      percentage: 0,
      isFeverTriggered: false,
    })
  },
}))
