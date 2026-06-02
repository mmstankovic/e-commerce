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

window.addEventListener('resize', function () {
    if (window.innerWidth > 678) {
        drawerMenu.classList.remove("open");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
    }
})