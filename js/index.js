import { products } from '../data/products.js'
import { getCart, addItemToCart, increaseCartItemQuantity, decreaseCartItemQuantity, removeItemFromCart } from './cart.js'
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
const allProducts = document.querySelector('.products')
const checkoutBtn = document.querySelector('.checkout-btn')
const toastContainer = document.querySelector('.toast-container')
const searchInputElement = document.querySelector('.search-input')
const categorySelect = document.querySelector('.category')
const noProductsMessage = document.querySelector('.no-products-message')
const sortSelect = document.querySelector('.sort')

let selectedSizes = {}
let searchInput = ''
let selectedCategory = ''
let activeSort = ''

function renderProducts(data, container) {
    if (noProductsMessage) {
        noProductsMessage.textContent = ''
    }
    container.innerHTML = ''

    let dataToDisplay = [...data]

    if (searchInput.length > 0) {
        dataToDisplay = dataToDisplay.filter((item) => item.name.toLowerCase().includes(searchInput))
    }
    if (selectedCategory) {
        dataToDisplay = dataToDisplay.filter((item) => item.category.toLowerCase() === selectedCategory)
    }

    if (activeSort === 'low') {
        dataToDisplay = [...dataToDisplay].sort((a, b) => a.price - b.price)
    } else if (activeSort === 'high') {
        dataToDisplay = [...dataToDisplay].sort((a, b) => b.price - a.price)
    }

    if (dataToDisplay.length === 0) {
        if (noProductsMessage) {
            noProductsMessage.textContent = 'No matching products found.'
        }
        return
    }

    dataToDisplay.forEach((item) => {
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

function renderFilterOptions() {
    const unique = [...new Set(products.map((item) => item.category))]
    const sorted = unique.sort((a, b) => a.localeCompare(b))

    sorted.forEach((opt) => {
        const option = document.createElement('option')
        option.textContent = opt
        option.value = opt.toLowerCase()

        categorySelect.appendChild(option)
    })
}

function renderCart(cart) {
    cartList.textContent = ''
    cartEmptyMessage.textContent = ''
    sumSpan.textContent = ''

    if (cart.length === 0) {
        cartEmptyMessage.textContent = 'Your cart is currently empty'
        checkoutBtn.disabled = true
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
    checkoutBtn.disabled = false
}

let refreshTimer

function refreshProducts() {
    if (!productList) return
    
    clearTimeout(refreshTimer)

    productList.style.opacity = '0';

    refreshTimer = setTimeout(() => {
        renderProducts(products, productList);
        productList.style.opacity = '1';
    }, 200);
}

function updateCartItemsNum(cart) {
    cartItemsNum.textContent = cart.reduce((acc, item) => acc += item.quantity, 0)
}

updateCart()

let timer

function setSearchTerm(val) {
    clearTimeout(timer)

    timer = setTimeout(() => {
        searchInput = val
        refreshProducts()
    }, 200)
}

function updateCart() {
    const cart = getCart()
    updateCartItemsNum(cart)
    renderCart(cart)
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.classList.add('toast', type)

    toastContainer.appendChild(toast)

    setTimeout(() => {
        toast.classList.add('show')
    }, 10)

    setTimeout(() => {
        toast.classList.remove('show')

        setTimeout(() => {
            toast.remove()
        }, 300)
    }, 2000)
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

allProducts.addEventListener('click', (e) => {
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
        showToast('Please select a size', 'info')
        return
    }
    const product = products.find((item) => item.id === id)

    addItemToCart(product, selected)
    updateCart()
    showToast('Added to cart')
})

cartList.addEventListener('click', (e) => {
    const cartItem = e.target.closest('.cart-item')

    if (!cartItem) return

    const cartId = cartItem.dataset.cartId

    if (e.target.closest('.increase-btn')) {
        increaseCartItemQuantity(cartId)
        updateCart()
    }

    if (e.target.closest('.decrease-btn')) {
        decreaseCartItemQuantity(cartId)
        updateCart()
    }

    if (e.target.closest('.remove-btn')) {
        removeItemFromCart(cartId)
        updateCart()
        showToast('Product removed', 'error')
    }
})

if (searchInputElement) {
    searchInputElement.addEventListener('input', (e) => {
        const normalizedQuery = e.target.value.trim().toLowerCase()

        setSearchTerm(normalizedQuery)
    })
}
if (categorySelect) {
    renderFilterOptions()

    categorySelect.addEventListener('change', (e) => {
        selectedCategory = e.target.value
        refreshProducts()
    })
}
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        activeSort = e.target.value

        refreshProducts()
    })
}

window.addEventListener('resize', function () {
    if (window.innerWidth > 678) {
        drawerMenu.classList.remove("open");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
    }
})