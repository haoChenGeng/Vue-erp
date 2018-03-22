<template>
    <div class="app-header">
        <div class="erp-header-left">
            <a href="javascript: void 0;"
                class="erp-logo">
                <img src="./img/logo@2x.png"
                    width="150">
            </a>
        </div>
        <div class="erp-header-right">
            <div class="center">
                <span class="faq"
                    @click="onFaq">常见问题</span>
                <!-- <span class="contact"
                    @click="onContact">联系客服</span> -->
                <a class="notify"
                    href="http://www.to8to.com/my/message_list_fcom.php"
                    target="_blank">
                    <img src="./img/notify.png"
                        width="20">
                </a>
                <img src="./img/avatar.png"
                    width="26"
                    class="avatar">
            </div>
            <el-dropdown>
                <div class="erp-header-user-info">
                    <span class="erp-header-user-name">{{username}} ( {{comname}} )</span>
                    <i class="">
                        <img src="./img/down.png"
                            width="12"
                            height="12"
                            style="margin-top: 5px">
                    </i>
                </div>
                <el-dropdown-menu slot="dropdown"
                    class="app-header-dropdown">
                    <el-dropdown-item @click.native="onLogout"
                        class="img-container">
                        <img src="./img/icon3.png"
                            width="13"
                            class="img">
                        <span>退出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
import Utils from 'src/utils/Utils.js'

export default {
    name: 'app-header',
    data() {
        let username = Cookie.get('t8t-tc-username')
        let comname = Cookie.get('t8t-tc-comname')
        return {
            username: username,
            comname: comname,
        }
    },

    methods: {
        onFaq() {
            this.$router.push('/helpcenter/page-faq')
        },
        onContact() {},
        onLogout() {
            Utils.logout()
        },
    },
}
</script>

<style lang="css" scoped>
.app-header {
    background-image: linear-gradient(57deg, #0dc798 4%, #15be78 100%);
    display: flex;
    justify-content: space-between;
    height: 88px;
}

.erp-header-left {
    width: 180px;
}

.erp-header-right {
    margin-right: 20px;
    display: flex;
}

.erp-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border-right: 1px solid #16b075;
}

.erp-header-user-info {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 100%;
}

.erp-header-user-name {
    margin: 0 10px;
    opacity: 0.84;
    font-size: 14px;
    color: #ffffff;
}

.erp-header-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.erp-header-icon {
    width: 20px;
    margin-right: 5px;
}

.avatar {
    border-radius: 50%;
}

.app-header .el-icon-caret-bottom {
    color: #9ea8b4;
    font-size: 12px;
    margin-top: 6px;
    transform: scale(0.8);
}

.app-header-dropdown .img-container {
    display: flex;
    align-items: center;
}

.app-header-dropdown .img {
    display: inline-block;
    margin-right: 10px;
}

.app-header-dropdown .border-top {
    border-top: 1px solid #d1dbe5;
}

.notification {
    padding: 0 25px;
}

.center {
    display: flex;
    align-items: center;
}
.notify {
    margin-right: 55px;
    margin-top: 5px;
}

.faq,
.contact {
    opacity: 0.84;
    font-size: 14px;
    color: #ffffff;
    margin-right: 30px;
    cursor: pointer;
}
</style>
