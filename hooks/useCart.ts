'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export interface CartItem {
  id: string
  productId: string
  productName: string
  size: string
  quantity: number
  price: number
  imageUrl: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  // Get current user
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()
  }, [])

  // Fetch cart items
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function fetchCart() {
      try {
        // Get or create cart
        let { data: cartData } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (!cartData) {
          const { data: newCart } = await supabase
            .from('carts')
            .insert({ user_id: userId })
            .select('id')
            .single()
          cartData = newCart
        }

        // Get cart items
        const { data: items } = await supabase
          .from('cart_items')
          .select(`
            id,
            product_id,
            size,
            quantity,
            products(id, name, price, image_url)
          `)
          .eq('cart_id', cartData.id)

        if (items) {
          const cartItems = items.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            productName: item.products.name,
            size: item.size,
            quantity: item.quantity,
            price: item.products.price,
            imageUrl: item.products.image_url,
          }))
          setCart(cartItems)
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [userId])

  const addToCart = async (
    productId: string,
    productName: string,
    size: string,
    quantity: number,
    price: number,
    imageUrl: string
  ) => {
    if (!userId) return

    try {
      // Get or create cart
      let { data: cartData } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!cartData) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: userId })
          .select('id')
          .single()
        cartData = newCart
      }

      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartData.id)
        .eq('product_id', productId)
        .eq('size', size)
        .single()

      if (existingItem) {
        // Update quantity
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
      } else {
        // Insert new item
        await supabase.from('cart_items').insert({
          cart_id: cartData.id,
          product_id: productId,
          size,
          quantity,
        })
      }

      // Refetch cart
      const { data: items } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          size,
          quantity,
          products(id, name, price, image_url)
        `)
        .eq('cart_id', cartData.id)

      if (items) {
        const cartItems = items.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.products.name,
          size: item.size,
          quantity: item.quantity,
          price: item.products.price,
          imageUrl: item.products.image_url,
        }))
        setCart(cartItems)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      await supabase.from('cart_items').delete().eq('id', cartItemId)
      setCart(cart.filter((item) => item.id !== cartItemId))
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId)
      } else {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', cartItemId)
        setCart(
          cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          )
        )
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const clearCart = async () => {
    if (!userId) return
    try {
      const { data: cartData } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (cartData) {
        await supabase.from('cart_items').delete().eq('cart_id', cartData.id)
        setCart([])
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  }
}
