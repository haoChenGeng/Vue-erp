<template>
    <div :style="{top:menuTop+'px',left:menuLeft+'px'}"
         v-clickoutside="handleOutsideClick"
         v-show="menuVisible"
         class="ctx-menu-content-tab"
         @contextmenu.prevent>
        <slot></slot>
    </div>
</template>

<script>
import Clickoutside from './clickoutside.js'
export default {
    name: 'CtxMenu',
    directives: {
        Clickoutside
    },
    props: {
        menuVisible: {
            type: Boolean,
            default: false
        },
        menuTop: Number,
        menuLeft: Number
    },
    methods: {
        openMenu(event) {
            event.preventDefault()
            event.stopPropagation()
            this.setPositionFromEvent(event)
            this.$nextTick(function () {
                this.menuVisible = true
            })
        },
        closeMenu() {
            this.menuVisible = false
        },
        itemClick(item) {
            this.$emit('menuClick', item.action)
            this.closeMenu()
        },
        handleOutsideClick(event) {
            this.closeMenu()
        },
        setPositionFromEvent(event) {
            const { pageX, pageY } = event
            this.menuTop = pageY - (document.body.scrollTop)
            this.menuLeft = pageX
        }
    }
}

</script>
