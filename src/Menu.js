
function computedStyle({ left: pLeft, right: pRight, top: pTop, bottom: pBottom }, { width, height }, direction) {
    let left = pRight, top = pTop
    if (pRight + width > window.innerWidth) (left = pLeft - width, direction = "left")
    if (pTop + height > window.innerHeight) top = pBottom - height

    if (left < 0) left = 0
    if (top < 0) top = 0

    return { left, top, direction }
}

function computedStyleLeft({ left: pLeft, right: pRight, top: pTop, bottom: pBottom }, { width, height }, direction) {
    let left = pLeft - width, top = pTop
    if (left < 0) (left = pRight, direction = "right")
    if (pTop + height > window.innerHeight) top = pBottom - height

    if (left > window.innerWidth) left = window.innerWidth - width
    if (top < 0) top = 0

    return { left, top, direction }
}

function createSvgString() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.style = "width: 14px; height:14px"
    svg.setAttribute('viewBox', "0 0 1024 1024")
    svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
    svg.innerHTML = `
    <path 
        d="M312.888889 995.555556c-17.066667 0-28.444444-5.688889-39.822222-17.066667-22.755556-22.755556-17.066667-56.888889 5.688889-79.644445l364.088888-329.955555c11.377778-11.377778 17.066667-22.755556 17.066667-34.133333 0-11.377778-5.688889-22.755556-17.066667-34.133334L273.066667 187.733333c-22.755556-22.755556-28.444444-56.888889-5.688889-79.644444 22.755556-22.755556 56.888889-28.444444 79.644444-5.688889l364.088889 312.888889c34.133333 28.444444 56.888889 73.955556 56.888889 119.466667s-17.066667 85.333333-51.2 119.466666l-364.088889 329.955556c-11.377778 5.688889-28.444444 11.377778-39.822222 11.377778z"  p-id="3988">
    </path>`
    return svg
}

/**
* 
* @param {{
*    plane: {[k:string]: style},
*    group: {
*        style: {[k:string]: style},
*        titleStyle: {[k:string]: style},
*    },
*    item: {
*        style: {[k:string]: style},
*        arrowColor: string,
*        descColor: string,
*        color: string,
*        bgColor: string,
*        activeBgColor: string,
*        activeColor: string,
*        activeDescColor: string,
*        activeArrowColor: string,
*    }
*}} theme 
* @returns 
*/
const MenuGenerator = function (theme) {

    let activeMenu

    class MenuItem {
        style = {
            minWidth: '180px',
            maxWidth: '360px',
            background: theme.item.bgColor || 'none',
            padding: '5px',
            cursor: "pointer",
            display: 'flex',
            fontSize: '14px',
            justifyContent: 'space-between',
            transition: '0.25s',
            color: theme.item.color || '#000',
            ...theme.item.style
        }

        arrowColor = theme.item.arrowColor || "rgb(153, 153, 153)"
        descColor = theme.item.descColor || '#000'
        icon = null

        activeBgColor = theme.item.activeBgColor || "rgb(230, 230, 230)"
        activeColor = theme.item.activeColor || '#000'
        activeDescColor = theme.item.activeDescColor || '#000'
        activeArrowColor = theme.item.activeArrowColor || "rgb(153, 153, 153)"
        activeIcon = null

        constructor(data) {
            this.data = data
            this.el = document.createElement("li")
            this.setStyle(this.data.style || {})
        }

        create() {
            this.initContent()
            this.initEvent()
        }

        initContent() {
            this.nameEl = document.createElement("div")
            this.nameEl.style.display = "flex"
            this.nameEl.style.alignContent = "center"
            if(this.data.icon){
                this.iconEl = document.createElement("img")
                this.iconEl.src = this.data.icon
                this.iconEl.style.width = "20px"
                this.iconEl.style.height = "20px"
                this.iconEl.style.marginRight = "5px"
                this.nameEl.appendChild(this.iconEl)
            }

            const name = document.createElement("span")
            name.innerHTML = this.data.name instanceof Function ? this.data.name(this.data) : this.data.name
            this.nameEl.appendChild(name)
            this.el.appendChild(this.nameEl)

            if (this.data.children) {
                this.arrowEl = createSvgString(this.arrowColor)
                this.el.appendChild(this.arrowEl)
                this.arrowEl.style.fill = this.arrowColor
            }
            else {
                this.descEl = document.createElement("span")
                this.descEl.innerHTML = this.data.desc || ''
                this.el.appendChild(this.descEl)
                this.descEl.style.color = this.descColor
                this.descEl.style.marginLeft = "10px"
            }
        }

        initEvent() {
            const li = this.el
            li.addEventListener("mouseover", (e) => {
                if (this.data.children) {
                    if (this.children) {
                        this.children.el.parentElement || li.appendChild(this.children.el)
                    }
                    else {
                        this.children = new MenuPlane(this.data.children)
                        this.children.direction = this.menuPlane.direction
                        this.children.menu = this
                        this.children.setStyle({
                            left: "0px",
                            top: "0px"
                        })

                        this.children.create(li)
                        const { left, top, direction} = this.menuPlane.direction === "left" 
                        ? computedStyleLeft(li.getBoundingClientRect(), this.children.el.getBoundingClientRect(), this.menuPlane.direction) 
                        : computedStyle(li.getBoundingClientRect(), this.children.el.getBoundingClientRect(), this.menuPlane.direction)

                        this.children.direction = direction
                        this.children.setStyle({
                            left: left + "px",
                            top: top + "px"
                        })
                    }
                }

                this.menuGroup.setActiveItem(this)

                e.preventDefault()
                e.stopPropagation()
            })

            li.addEventListener("mouseleave", (e) => {
                if(!this.children){
                    this.menuGroup.setActiveItem(null)
                }
            })

            li.addEventListener("mousedown", (e) => {
                e.preventDefault()
                e.stopPropagation()
            })

            li.addEventListener("click", (e) => {
                this.data.click && this.data.click({
                    close: this.close.bind(this),
                    data: this.data
                })
            })
        }

        onCancelActive() {
            if (this.children && this.children.el.parentElement) {
                this.el.removeChild(this.children.el)
            }
            this.arrowEl && (this.arrowEl.style.fill = this.arrowColor)
            this.descEl && (this.descEl.style.color = this.descColor)

            this.iconEl && (this.iconEl.src = this.data.icon)

            this.setStyle()
        }

        onActive() {
            this.el.style.color = this.activeColor
            this.el.style.background = this.activeBgColor

            this.arrowEl && (this.arrowEl.style.fill = this.activeArrowColor)
            this.descEl && (this.descEl.style.color = this.descColor)

            this.iconEl && (this.iconEl.src = this.data.activeIcon || this.data.icon)
        }

        setStyle(style = {}) {
            Object.assign(this.style, style)
            Object.keys(this.style).forEach(k => this.el.style[k] = this.style[k])
        }

        attach(menuGroup) {
            this.menuGroup = menuGroup
            menuGroup.el.appendChild(this.el)
        }

        close() {
            activeMenu && activeMenu.close()
        }
    }

    class MenuGroup {
        style = {
            ...theme.group.style
        }

        titleStyle = {
            padding: "5px",
            borderBottom: "solid 1px whitesmoke",
            ...theme.group.titleStyle
        }

        constructor(data) {
            this.data = data

            this.el = document.createElement("ul")
            this.titleEl = document.createElement("h5")
            this.setStyle(this.data.style || {})
            this.setTitleStyle({
                display: this.data.name === undefined ? 'none' : 'block',
                ...(this.data.titleStyle || {}),
            })
        }

        create() {
            this.titleEl.innerHTML = this.data.name

            this.data.items.forEach(item => {
                const menuItem = new MenuItem(item)
                menuItem.menuGroup = this
                menuItem.menuPlane = this.menuPlane
                menuItem.create()
                menuItem.attach(this)
            })
        }

        setStyle(style = {}) {
            Object.assign(this.style, style)
            Object.keys(this.style).forEach(k => this.el.style[k] = this.style[k])
        }

        setTitleStyle(style = {}) {
            Object.assign(this.titleStyle, style)
            Object.keys(this.titleStyle).forEach(k => this.titleEl.style[k] = this.titleStyle[k])
        }

        setActiveItem(item) {
            this.menuPlane.setActiveItem(item)
        }

        attach(menuPlane) {
            this.menuPlane = menuPlane
            menuPlane.el.appendChild(this.titleEl)
            menuPlane.el.appendChild(this.el)
        }

        close() {
            activeMenu && activeMenu.close()
        }
    }

    class MenuPlane {
        style = {
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 10000,
            background: '#fff',
            boxShadow: "0 0 5px gray",
            border: "solid 1px rgb(196, 196, 196)",
            outline: "none",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "5px 0",
            ...theme.plane
        }

        data = null

        direction = "right"

         /**
         * @var items
         * @param {{name?: string, items: items[] }[]} data 
         */
        constructor(data) {
            this.data = data
            this.el = document.createElement("div")
            this.setStyle(this.data.style || {})
        }

        setStyle(style = {}) {
            Object.assign(this.style, style)
            Object.keys(this.style).forEach(k => this.el.style[k] = this.style[k])
        }

        create(parentNode = document.body) {
            this.data.forEach(group => {
                const menuGroup = new MenuGroup(group)
                menuGroup.menuPlane = this
                menuGroup.create()
                menuGroup.attach(this)
            })

            parentNode.appendChild(this.el)
        }

        setActiveItem(item) {
            if (item === this.activeItem) return
            this.activeItem && this.activeItem.onCancelActive()
            this.activeItem = item
            this.activeItem && this.activeItem.onActive()
        }

        close() {
            this.el.parentNode && this.el.parentNode.removeChild(this.el)
        }
    }

    class Menu {
        /**
         * @var items
         * @param {{name?: string, items: items[] }[]} data 
         */
        constructor(data) {
            this.data = data
        }

        show(x, y) {
            this.x = x
            this.y = y
            this.menuPlane = new MenuPlane(this.data)
            this.menuPlane.menu = this

            this.menuPlane.setStyle({
                left: this.x + "px",
                top: this.y + "px"
            })

            this.menuPlane.create()

            this.menuPlane.el.tabIndex = 0

            this.menuPlane.el.addEventListener("blur", () => {
                this.menuPlane.close()
            })

            setTimeout(this.menuPlane.el.focus.bind(this.menuPlane.el))

            const { width, height } = this.menuPlane.el.getBoundingClientRect()

            if (this.x + width > window.innerWidth) this.x = this.x - width
            if (this.y + height > window.innerHeight) this.y = this.y - height

            if (this.x < 0) this.x = 0
            if (this.y < 0) this.y = 0

            this.menuPlane.setStyle({
                left: this.x + "px",
                top: this.y + "px"
            })

            activeMenu = this
        }

        close() {
            this.menuPlane && this.menuPlane.el.blur()
            activeMenu = null
        }
    }

    return Menu
}

const Menu = MenuGenerator({
    plane: {},
    group: {
        style: {},
        titleStyle: {}
    },
    item: {
        style: {
            minWidth: "250px"
        },
        arrowColor: '',
        descColor: '',
        color: '',
        bgColor: '',
        activeBgColor: '',
        activeColor: '',
        activeDescColor: '',
        activeArrowColor: '',
    }
})

const createMenuDark = (color) => {
    return MenuGenerator({
        plane: {
            background: '#373737',
            borderRadius: "6px",
        },
        group: {
            style: {},
            titleStyle: {
                paddingTop: '10px',
                color: color
            }
        },
        item: {
            style: {
                minWidth: "250px"
            },
            arrowColor: '#fff',
            descColor: '#fff',
            color: '#fff',
            bgColor: 'none',
            activeBgColor: color,
            activeColor: '#fff',
            activeDescColor: '#fff',
            activeArrowColor: '#fff',
        }
    })
}

const MenuDark = createMenuDark("#009688")
const MenuDark1 = createMenuDark("#409eff")
export {
    MenuDark, Menu, MenuDark1,createMenuDark,  MenuGenerator
}