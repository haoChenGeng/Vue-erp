<template>
    <div class="my-select" @click.self="onClick">
        <el-tag
          class="my-tag"
          v-for="item in selected"
          :key="item.value"
          closable
          type="primary"
          @close="deleteTag($event, item)"
          close-transition>
          <span class="el-select__tags-text">{{ item.currentLabel }}</span>
        </el-tag>
    </div>
</template>

<script>
    export default {

      name: 'my-select',

      data () {
        return {

        };
      },
      props: {
        selected: {
            type: Array,
            default: []
        }
      },
      methods: {
        deleteTag(event, tag) {
          let index = this.selected.indexOf(tag);
          this.selected.splice(index, 1);
        },
        onClick() {
          this.$emit('select-click')
        }
      }
    };
</script>

<style lang="css" scoped>
  .my-select{
    width: 100%;
    border: 1px solid #bfcbd9;
    border-radius: 2px;
    min-height: 32px;
  }
  .my-tag{
    margin: 3px 0 3px 6px;
  }
</style>
