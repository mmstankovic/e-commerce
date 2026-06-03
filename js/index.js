import { products } from '../data/products.js'
const featuredList = document.querySelector('.featured-product-list')
const productList = document.querySelector('.product-list')
const cartBtn = document.querySelector('.cart-btn')
const overlay = document.querySelector('.overlay')
const cartDrawer = document.querySelector('.cart-drawer')
const closeCartBtn = document.querySelector('.close-cart-btn')
const menuBtn = document.querySelector('.menu-btn')
const drawerMenu = document.querySelector('.menu-drawer')
const closeMenuBtn = document.querySelector('.close-menu-btn')
const cartList = document.querySelector('.cart-list')
const cartEmptyMessage = document.querySelector('.cart-empty-message')
const sumSpan = document.querySelector('.sum')
const cartItemsNum = document.querySelector('.items-number')

let cart = []
let selectedSizes = {}

function renderProducts(data, container) {
    data.forEach((item) => {
        const li = document.createElement('li')
        li.classList.add('product-item')
        li.id = item.id

        const imageContainer = document.createElement('div')
        imageContainer.classList.add('image-container')
        const image = document.createElement('img')
        image.src = item.image

        imageContainer.appendChild(image)

        const divContainer = document.createElement('div')
        divContainer.classList.add('product-item-info')

        const name = document.createElement('p')
        name.textContent = item.name
        name.classList.add('product-item-name')

        const price = document.createElement('p')
        price.textContent = `$${item.price}`
        price.classList.add('product-item-price')

        divContainer.append(name, price)

        const actionContainer = document.createElement('div')
        actionContainer.classList.add('action-container')

        const sizeContainer = document.createElement('div')
        sizeContainer.classList.add('size-container')

        item.sizes.forEach((itemSize) => {
            const sizeBtn = document.createElement('button')
            sizeBtn.textContent = itemSize
            sizeBtn.classList.add('size-btn')
            sizeBtn.dataset.size = itemSize
            sizeContainer.appendChild(sizeBtn)
        })

        const addBtn = document.createElement('button')
        addBtn.textContent = 'Add to cart'
        addBtn.classList.add('add-btn')

        actionContainer.append(sizeContainer, addBtn)

        divContainer.appendChild(actionContainer)

        li.append(imageContainer, divContainer)

        container.appendChild(li)

    })

}

const featured = products.filter((item) => item.featured)

if (productList) {
    renderProducts(products, productList)
}

if (featuredList) {
    renderProducts(featured, featuredList)
}

function renderCart() {
    cartList.textContent = ''
    cartEmptyMessage.textContent = ''
    sumSpan.textContent = ''

    if (cart.length === 0) {
        cartEmptyMessage.textContent = 'Your cart is currently empty'
        return
    }

    cart.forEach((item) => {
        const li = document.createElement('li')
        li.id = item.id
        li.dataset.cartId = item.cartId
        li.classList.add('cart-item')

        const imageContainer = document.createElement('div')
        imageContainer.classList.add('cart-img-container')
        const cartImg = document.createElement('img')
        cartImg.src = item.image
        imageContainer.appendChild(cartImg)

        const cartItemContent = document.createElement('div')
        cartItemContent.classList.add('cart-item-content')

        const name = document.createElement('p')
        name.textContent = item.name
        name.classList.add('cart-item-name')
        const quantity = document.createElement('p')
        quantity.textContent = `Quantity: ${item.quantity}`
        quantity.classList.add('cart-item-quantity')
        const size = document.createElement('p')
        size.textContent = `Size: ${item.size}`
        size.classList.add('cart-item-size')

        cartItemContent.append(name, quantity, size)

        const cartItemActions = document.createElement('div')
        cartItemActions.classList.add('cart-item-actions')

        const decreaseBtn = document.createElement('button')
        decreaseBtn.innerHTML = `<i class="fa-solid fa-minus"></i>`
        decreaseBtn.classList.add('decrease-btn')

        const increaseBtn = document.createElement('button')
        increaseBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`
        increaseBtn.classList.add('increase-btn')

        cartItemActions.append(decreaseBtn, increaseBtn)

        const removeBtn = document.createElement('button')
        removeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`
        removeBtn.classList.add('remove-btn')

        li.append(imageContainer, cartItemContent, cartItemActions, removeBtn)

        cartList.appendChild(li)
    })


    const totalAmount = cart.reduce((acc, item) => acc += item.price * item.quantity, 0)

    sumSpan.textContent = `$${totalAmount.toLocaleString('en-US')}`
}

renderCart()

function updateCartItemsNum() {
    cartItemsNum.textContent = cart.reduce((acc, item) => acc += item.quantity, 0)
}

updateCartItemsNum()

function addItemToCart(newItem, size) {
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

    updateCartItemsNum()
    renderCart()
}

function increaseCartItemQuantity(cartId) {
    cart = cart.map((item) => item.cartId === cartId ? ({ ...item, quantity: item.quantity + 1 }) : item)

    updateCartItemsNum()
    renderCart()
}

function decreaseCartItemQuantity(cartId) {
    const cartItem = cart.find((item) => item.cartId === cartId)

    if (!cartItem) return

    if (cartItem.quantity === 1) {
        cart = cart.filter((item) => item.cartId !== cartId)
    } else {
        cart = cart.map((item) => item.cartId === cartId ? ({ ...item, quantity: item.quantity - 1 }) : item)
    }

    updateCartItemsNum()
    renderCart()
}

function removeItemFromCart(cartId) {
    cart = cart.filter((item) => item.cartId !== cartId)

    updateCartItemsNum()
    renderCart()
}

function openMobileMenu() {
    overlay.classList.add('active')
    drawerMenu.classList.add('open')
    document.body.classList.add("menu-open");
}

function closeMobileMenu() {
    overlay.classList.remove('active')
    drawerMenu.classList.remove('open')
    document.body.classList.remove("menu-open");
}

function openShoppingCart() {
    if (drawerMenu.classList.contains('open')) {
        drawerMenu.classList.remove('open')

        setTimeout(() => {
            cartDrawer.classList.add('open')
        }, 300)
    } else {
        cartDrawer.classList.add('open')
        document.body.classList.remove('menu-open');
    }

    overlay.classList.add('active')
}

function closeShoppingCart() {
    overlay.classList.remove('active')
    cartDrawer.classList.remove('open')
    drawerMenu.classList.remove('open')
    document.body.classList.remove('menu-open');
}

menuBtn.addEventListener('click', openMobileMenu)
closeMenuBtn.addEventListener('click', closeMobileMenu)

cartBtn.addEventListener('click', openShoppingCart)
overlay.addEventListener('click', closeShoppingCart)
closeCartBtn.addEventListener('click', closeShoppingCart)

productList.addEventListener('click', (e) => {
    const sizeBtn = e.target.closest('.size-btn')

    if (sizeBtn) {
        const productItem = e.target.closest('.product-item')
        const productId = Number(productItem.id)
        const size = sizeBtn.dataset.size

        selectedSizes[productId] = size

        const allSizes = productItem.querySelectorAll('.size-btn')
        allSizes.forEach((btn) => btn.classList.remove('selected'))

        sizeBtn.classList.add('selected')
        return
    }
    const addBtn = e.target.closest('.add-btn')

    if (!addBtn) return

    const li = addBtn.closest('.product-item')
    const id = Number(li.id)

    const selected = selectedSizes[id]

    if (!selected) {
        alert('Please select a size')
        return
    }
    const product = products.find((item) => item.id === id)

    addItemToCart(product, selected)
})

cartList.addEventListener('click', (e) => {
    const cartItem = e.target.closest('.cart-item')

    if (!cartItem) return

    const cartId = cartItem.dataset.cartId

    if (e.target.closest('.increase-btn')) {
        increaseCartItemQuantity(cartId)
    }

    if (e.target.closest('.decrease-btn')) {
        decreaseCartItemQuantity(cartId)
    }

    if (e.target.closest('.remove-btn')) {
        removeItemFromCart(cartId)
    }
})

window.addEventListener('resize', function () {
    if (window.innerWidth > 678) {
        drawerMenu.classList.remove("open");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
    }
})