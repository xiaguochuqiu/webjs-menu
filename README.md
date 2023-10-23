### 安装
```javascript
npm i webjs-menu
```

### 使用
```javascript
import { MenuDark, Menu, MenuDark1,createMenuDark,  MenuGenerator } from "webjs-menu"
// Menu 默认主题
// MenuDark 黑色主题菜单
// MenuDark1 黑色主题菜单
// createMenuDark 创建自定义黑色主题菜单
// MenuGenerator 自定义任意主题菜单

new Menu(
// 第一层数组为组，每一组里面有三个属性，name、items、style ，name、style可不写
// 第二层 items 数组 是菜单项，菜单项属性有：name、desc、style、arrowColor、descColor、color、 bgColor、 activeBgColor、activeColor、activeDescColor、 activeArrowColor、children
// 这些属性可以根据需求设置，children创建层级菜单，就像window菜单那样的展开方式，children的层次结构和父级是一样的，从创建组开始
[
    {
        name:"测试1组",
        items:[
            {
                name: "菜单项1",
                desc: "Ctrl + A",
                style:{
                    color: "red"
                },
                children:[
                    // 组
                    {

                    }
                ]
            },
            {
                name: "菜单项2"
            },
            {
                name: "菜单项3"
            }
        ]
    },
    {
        name:"测试2组",
        items:[
            {
                name: "菜单项1",
                style:{
                    color: "red"
                }
            },
            {
                name: "菜单项2"
            },
            {
                name: "菜单项3"
            }
        ]
    }
]
).show(100, 100) // show两个参数是显示位置，需要自己传入
```

我们不可能给每一菜单项都配置上：style、arrowColor、descColor、color、 bgColor、 activeBgColor、activeColor、activeDescColor、 activeArrowColor这些属性，那样会很麻烦，可以使用MenuGenerator创建一个菜单模板
```javascript
const MyMenuDark = MenuGenerator({
    plane: { // 菜单面板style设置
        background: '#373737',
        borderRadius: "6px",
    },
    group: { 
        style: {}, // 菜单组style设置
        titleStyle: { // 组里面标题style设置
            paddingTop: '10px',
            color: color
        }
    },
    item: {
        style: { // 菜单项style设置
            minWidth: "250px"
        },
        arrowColor: '#fff', // 默认菜单项右边多级箭头颜色
        descColor: '#fff', // 默认描述文字颜色
        color: '#fff', // 默认菜单文字颜色
        bgColor: 'none', // 默认菜单背景色
        activeBgColor: color, // 激活菜单背景色
        activeColor: '#fff', // 激活菜单文字颜色
        activeDescColor: '#fff', // 激活描述文字颜色
        activeArrowColor: '#fff', // 激活菜单项右边多级箭头颜色
    }
})
```

然后使用我们自己定义主题的菜单
```javascript
new MyMenuDark(
[
    {
        name:"测试1组",
        items:[
            {
                name: "菜单项1",
                desc: "Ctrl + A",
                children:[
                    // 组
                    {
                        ...
                    }
                ]
            },
            {
                name: "菜单项2"
            },
            {
                name: "菜单项3"
            }
        ]
    },
    {
        name:"测试2组",
        items:[
            {
                name: "菜单项1",
                style:{
                    color: "red"
                }
            },
            {
                name: "菜单项2"
            },
            {
                name: "菜单项3"
            }
        ]
    }
]
).show() // show两个参数是显示位置，需要自己传入
```