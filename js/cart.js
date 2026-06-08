let cart = JSON.parse(localStorage.getItem('shopping-cart')) || []

function saveToStorage() {
    localStorage.setItem('shopping-cart', JSON.stringify(cart))
}

export function getCart() {
    return cart
}

export function addItemToCart(newItem, size) {
    const existingCartItem = cart.find((item) => item.id === newItem.id && item.size === size)

    if (existingCartItem) {
        cart = cart.map((item) => item.id === newItem.id && item.size === size ? ({ ...item, quantity: item.quantity + 1 }) : item)
    } else {
        cart = [...cart, {
            ...newItem,
            cartId: `${newItem.id}-${size}`,
            size,
            quantity: 1
        }]
    }

   saveToStorage()
}

export function increaseCartItemQuantity(cartId) {
    cart = cart.map((item) => item.cartId === cartId ? ({ ...item, quantity: item.quantity + 1 }) : item)

    saveToStorage()
}

export function decreaseCartItemQuantity(cartId) {
    const cartItem = cart.find((item) => item.cartId === cartId)

    if (!cartItem) return

    if (cartItem.quantity === 1) {
        cart = cart.filter((item) => item.cartId !== cartId)
    } else {
        cart = cart.map((item) => item.cartId === cartId ? ({ ...item, quantity: item.quantity - 1 }) : item)
    }

    saveToStorage()
}

export function removeItemFromCart(cartId) {
    cart = cart.filter((item) => item.cartId !== cartId)

    saveToStorage()
}