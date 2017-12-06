---
category: components
name: t8t-form-panel
purpose: 可按需配置字段的表单面板。
---

## 何时使用

- 建议在全屏弹窗界面中使用
- 可通过json配置表单项，对于复杂表单项也可通过slot模板定义

## 如何使用

- 直接在页面中引用组件即可

```
import T8tFormPanel from 'src/components/t8t-form-panel/t8t-form-panel.vue'
<t8t-form-panel :dataSource="dataSource" :commonData="commonData" :fields="fields"></t8t-form-panel>
```

- 指定表单的数据源 `dataSource` 为一个数组。
- 指定表单的列表项目 `commonData` 为一个数组，一般可与页面中的表格组件共享此数据。
- 如果内置配置项无法满足需求，可以使用自定义列模板，通过设置 `slot` 属性为列字段名称即可自动匹配。

```
<t8t-form-panel
    :dataSource="formData"
    :fields="fields"
    :commonData="commonData"
>
    <template
            slot="businessType"
            scope="scope"
        >
        <el-color-picker v-model="formData[scope]">
        </el-color-picker>
    </template>
</t8t-form-panel>
```

## 温馨提示

- 当配置项过于复杂时，可以将配置项存储在页面相同目录下的json文件中引用。

```jsx
//tableConfig.json
const dataSource = {
    "bizId": null,
    "createUser": null,
    "fundPurposeId": null,
    "oughtAmount": null,
    "projectId": null
};

const columns = [{
    prop: 'bizId',
    label: '业务类型',
    type: 'select',
    list: 'bizs',
    rules: [{
        required: true,
        message: '不能为空'
    }]
}, {
    prop: 'fundPurposeId',
    label: '款项用途',
    type: 'select',
    list: 'fundPurposes',
    rules: [{
        required: true,
        message: '不能为空'
    }]
}, {
    prop: 'oughtAmount',
    label: '应收金额',
    type: 'number',
    rules: [{
        required: true,
        message: '不能为空'
    }, {
        type: 'number',
        message: '必须为数字值'
    }]
}, {
    prop: 'projectId',
    label: '项目ID',
    type: 'input',
    rules: [{
        required: true,
        message: '不能为空'
    }]
}]
```

## API

### Table

| 参数           | 说明                     | 类型             | 默认值   |
|---------------|--------------------------|-----------------|---------|
| dataSource | 表单数据源，包含个字段属性的json对象 | Object | {} |
| commonData | 辅助资料数据源，用于列表选项 | Object  | null  |
| fields | 表格列配置项，详情见下表 | Object |  |


### field

表单项配置，是 fields 中的一项。

| 参数       | 说明                       | 类型            |  默认值  |
|-----------|----------------------------|-----------------|---------|
| prop | 表单项绑定的字段名称 | String | - |
| label | 表单项的标题文字 | String | '' |
| type | 表单项的编辑器类型，可设置 `'input'` `'select'` `'button'`等，支持 ElementUI 提供的全部类型 | String | - |
| list | 列绑定的辅助资料 | Array | - |
| rules | 设置编辑器验证规则，如 `[{"required": true, "message": "不能为空"}]` | Array | - |



