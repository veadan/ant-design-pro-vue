<template>
  <div class="app-container calendar-list-container">
    <a-row :gutter="8">
      <a-col :span="5">
        <a-card :bordered="false">
          <a-button-group >
            <a-button type="primary" v-if="menuManager_btn_add" value="add" @click="handlerAdd">新增</a-button>
            <a-button type="dashed" v-if="menuManager_btn_edit" value="upd" @click="handlerEdit">修改</a-button>
            <a-button type="danger" v-if="menuManager_btn_del" value="del" @click="handleDelete">删除</a-button>
          </a-button-group>
          <div style="margin: 24px 0" />
          <a-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </a-input>
          <el-tree
            class="filter-tree"
            :data="treeData"
            node-key="id"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="menuTree"
            @node-click="getNodeData"
            default-expand-all
          >
          </el-tree>
        </a-card>
      </a-col>
      <a-col :span="19">
        <a-row :gutter="8">
          <a-card :bordered="false" title="基础信息">
            <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
              <el-form-item label="路径编码" prop="code">
                <a-input v-model="form.code" :disabled="formEdit" placeholder="请输入路径编码"></a-input>
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <a-input v-model="form.title" :disabled="formEdit" placeholder="请输入标题"></a-input>
              </el-form-item>
              <el-form-item label="排序" prop="orderNum">
                <a-input-number :min="0" :max="100" :disabled="formEdit" v-model="form.orderNum" />
              </el-form-item>
              <el-form-item label="父级节点" prop="parentId">
                <a-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点"></a-input>
              </el-form-item>
              <el-form-item label="图标" prop="icon">
                <a-button :icon="form.icon" :disabled="formEdit" shape="circle" @click="selectIcon()" />
              </el-form-item>
              <el-form-item label="图标" prop="icon">
                <icon-font type="icon-nongmin" />
              </el-form-item>
              <el-form-item label="资源路径" prop="href">
                <a-input v-model="form.href" :disabled="formEdit" placeholder="请输入资源路径"></a-input>
              </el-form-item>
              <el-form-item label="显示菜单" prop="attr3">
                <el-switch
                  :disabled="formEdit"
                  v-model="form.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="显示"
                  inactive-text="不显示"
                  active-value="1"
                  inactive-value="0">
                </el-switch>
              </el-form-item>
              <el-form-item label="面包屑" prop="attr3">
                <el-switch
                  :disabled="formEdit"
                  v-model="form.attr3"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="显示"
                  inactive-text="不显示"
                  active-value="1"
                  inactive-value="0">
                </el-switch>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <a-select v-model="form.type" :disabled="formEdit" placeholder="请输入资源请求类型">
                  <a-select-option v-for="item in typeOptions" :key="item.id" :value="item.value">{{ item.labelDefault }} </a-select-option>
                </a-select>
              </el-form-item>
              <el-form-item label="前端组件" prop="attr1">
                <a-input
                  addonBefore="() => import('@/views"
                  addonAfter=".vue')"
                  v-model="form.attr1"
                  v-if="form.type==='menu'"
                  :disabled="formEdit"
                  placeholder="前端路由的文件目录"></a-input>
                <a-select v-model="form.attr1" v-if="form.type!=='menu'" :disabled="formEdit" placeholder="请输入资源请求类型">
                  <a-select-option v-for="item in layoutOptions" :key="item.value" :value="item.value">{{ item.lable }} </a-select-option>
                </a-select>
              </el-form-item>
              <el-form-item label="重定向" prop="attr2">
                <a-input
                  v-model="form.attr2"
                  :disabled="formEdit"
                  placeholder="路由重定向"
                />
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <a-input v-model="form.description" :disabled="formEdit" placeholder="请输入描述"></a-input>
              </el-form-item>
              <el-form-item v-if="formStatus === 'update'">
                <div class="table-operator">
                  <a-button type="primary" @click="update">更新</a-button>
                  <a-button @click="onCancel">取消</a-button>
                </div>
              </el-form-item>
              <el-form-item v-if="formStatus === 'create'">
                <div class="table-operator">
                  <a-button type="primary" @click="create">保存</a-button>
                  <a-button @click="onCancel">取消</a-button>
                </div>
              </el-form-item>
            </el-form>
          </a-card>
          <a-card :bordered="false" title="资源权限" style="margin-top: 10px;">
            <menu-element :menuId="currentId" ref="menuElement"></menu-element>
          </a-card>
        </a-row>
      </a-col>
      <a-modal :title="'选择图标'" @cancel="cancel" :visible.sync="dialogIconVisible">
        <a-card :bordered="false">
          <icon-selector @change="handleIconChange"/>
        </a-card>
        <div slot="footer" class="dialog-footer">
          <a-button @click="cancel">清 除</a-button>
        </div>
      </a-modal>
    </a-row>
  </div>
</template>

<script>
import {
  fetchTree, getObj, addObj, delObj, putObj
} from '@/api/admin/menu/index'
import { mapGetters } from 'vuex'
import { getTypeValue } from '@/api/dict/dictValue/index'
import IconSelector from '@/components/IconSelector'
import IconFont from '../../../components/IconFontSelector/IconFont'
export default {
  components: {
    IconFont,
    'menu-element': () => import('./components/menuElement'),
    IconSelector
  },
  data () {
    return {
      dialogIconVisible: false,
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: [],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      labelPosition: 'right',
      form: {
        code: undefined,
        title: undefined,
        parentId: undefined,
        href: undefined,
        icon: undefined,
        orderNum: undefined,
        description: undefined,
        path: undefined,
        enabled: '1',
        type: 'authority_menu_menu',
        attr1: undefined,
        attr2: undefined,
        attr3: '1'
      },
      currentId: -1,
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false,
      layoutOptions: [{ value: 'BasicLayout', lable: 'BasicLayout' },
        { value: 'BlankLayout', lable: 'BlankLayout' },
        { value: 'RouteView', lable: 'RouteView' },
        { value: 'PageView', lable: 'PageView' }]
    }
  },
  watch: {
    filterText (val) {
      this.$refs.menuTree.filter(val)
    }
  },
  created () {
    this.getList()
    this.menuManager_btn_add = this.elements['menuManager:btn_add']
    this.menuManager_btn_del = this.elements['menuManager:btn_del']
    this.menuManager_btn_edit = this.elements['menuManager:btn_edit']
    getTypeValue('authority_menu').then(response => {
      this.typeOptions = response.data.rows
    })
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    cancel () {
      this.form.icon = undefined
      this.dialogIconVisible = false
    },
    handleIconChange (icon) {
      this.form.icon = icon
      this.dialogIconVisible = false
    },
    selectIcon () {
      this.dialogIconVisible = true
    },
    getList () {
      fetchTree(this.listQuery).then(data => {
        this.treeData = data
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData (data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getObj(data.id).then(response => {
        this.form = response.data
      })
      this.currentId = data.id
      this.showElement = true
      this.$refs.menuElement.menuId = data.id
      this.$refs.menuElement.getList()
    },
    handlerEdit () {
      if (this.form.id) {
        this.formEdit = false
        this.formStatus = 'update'
      }
    },
    handlerAdd () {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
    },
    handleDelete () {
      const { $confirm, $notification, currentId, getList, resetForm, onCancel } = this
      $confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续? ?',
        onOk () {
          delObj(currentId).then(() => {
            getList()
            resetForm()
            onCancel()
            $notification['success']({
              message: '提示',
              description: '删除成功',
              duration: 8
            })
          })
        },
        onCancel () {
        }
      })
    },
    update () {
      putObj(this.form.id, this.form).then(() => {
        this.getList()
        this.$notification['success']({
          message: '成功',
          description: '更新成功',
          duration: 8
        })
      })
    },
    create () {
      addObj(this.form).then(() => {
        this.getList()
        this.$notification['success']({
          message: '成功',
          description: '创建成功',
          duration: 8
        })
      })
    },
    onCancel () {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm () {
      this.form = {
        code: undefined,
        title: undefined,
        parentId: this.currentId,
        href: undefined,
        icon: undefined,
        orderNum: undefined,
        description: undefined,
        path: undefined,
        enabled: '1',
        attr1: undefined,
        attr2: undefined,
        attr3: '1'
      }
    }
  }
}
</script>
