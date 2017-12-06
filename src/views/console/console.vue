<template>
    <div class="console">
        <app-header></app-header>
        <div class="console-body">
            <app-sidebar :hide="sidebarHide"
                         @toggle-button-click="handleToggleButtonClick"></app-sidebar>
            <app-content :stretch="sidebarHide"></app-content>
        </div>
    </div>
</template>
<script>
import AppHeader from '../../components/app-header/app-header.vue'
import AppSidebar from '../../components/app-sidebar/app-sidebar.vue'
import AppContent from '../../components/app-content/app-content.vue'
export default {
    name: 'console',
    components: {
        AppHeader,
        AppSidebar,
        AppContent
    },
    data() {
        return {
            sidebarHide: false,
        }
    },
    methods: {
        handleToggleButtonClick() {
            this.sidebarHide = !this.sidebarHide
        }
    }
}

</script>

<style>
.console {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.console-body {
    flex: 1;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    position: relative
}

.console .erp-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
}

.console .el-progress-bar__outer {
    background-color: transparent;
    border-radius: 0;
}

.console .el-progress-bar__inner {
    border-radius: 0;
}

.console .app-header {
    width: 100%;
    height: 60px;
}
</style>
