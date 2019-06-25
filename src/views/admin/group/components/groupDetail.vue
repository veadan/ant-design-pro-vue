<template>
  <a-row :gutter="8">
    <a-col :span="24">
      <a-button-group>
        <a-button type="primary" v-if="groupManager_btn_add" icon="plus" @click="handlerAdd">添加</a-button>
        <a-button type="primary" v-if="groupManager_btn_edit" icon="edit" @click="handlerEdit">修改</a-button>
        <a-button type="primary" v-if="groupManager_btn_del" icon="delete" @click="handleDelete">删除</a-button>
        <a-tooltip placement="top" >
          <template slot="title">
            <span>分配可访问菜单和资源</span>
          </template>
          <a-button v-if="groupManager_btn_resourceManager" @click="handlerAuthority">
            分配权限</a-button>
        </a-tooltip>
        <a-tooltip placement="top" >
          <template slot="title">
            <span>角色组与用户关联</span>
          </template>
          <a-button v-if="groupManager_btn_userManager" @click="handlerUser">
            关联用户</a-button>
        </a-tooltip>
        <a-tooltip placement="top" >
          <template slot="title">
            <span>使角色组拥有可分配权限的能力和范围</span>
          </template>
          <a-button v-if="groupManager_btn_authorizeManager" @click="handlerAuthorize">
            分配授权</a-button>
        </a-tooltip>
      </a-button-group>
    </a-col>
    <a-col :span="8" style="margin-top:15px;">
      <a-card :bordered="false">
        <a-input placeholder="输入关键字进行过滤" v-model="filterText" style="margin-bottom: 10px"> </a-input>
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          ref="groupTree"
          @node-click="getNodeData"
          default-expand-all> </el-tree>
      </a-card>
    </a-col>
    <a-col :span="16" style="margin-top:15px;">
      <a-card :bordered="false">
        <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="form" ref="form">
          <el-form-item label="名称" prop="name">
            <a-input v-model="form.name" :disabled="formEdit"></a-input>
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <a-input v-model="form.code" :disabled="formEdit"></a-input>
          </el-form-item>
          <el-form-item label="描述">
            <a-input v-model="form.description" :disabled="formEdit"></a-input>
          </el-form-item>
          <el-form-item v-if="formStatus == 'update'">
            <div class="table-operator">
              <a-button type="primary" v-if="groupManager_btn_edit" @click="update('form')">更新</a-button>
              <a-button @click="onCancel">取消</a-button>
            </div>
          </el-form-item>
          <el-form-item v-if="formStatus == 'create'">
            <div class="table-operator">
              <a-button type="primary" v-if="groupManager_btn_add" @click="create('form')">保存</a-button>
              <a-button @click="onCancel">取消</a-button>
            </div>
          </el-form-item>
        </el-form>
      </a-card>
    </a-col>
    <a-modal :title="dialogUserName" :visible.sync="dialogUserVisible" @cancel="closeUserDialog">
      <group-user :groupId="currentId" @closeUserDialog="closeUserDialog" ref="groupUser"></group-user>
    </a-modal>
    <a-modal :title="dialogAuthorityName" width="60%" size="large" :visible.sync="dialogAuthorityVisible" @cancel="closeAuthorityDialog">
      <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
    </a-modal>
    <a-modal :title="dialogAuthorizeName" width="60%" size="large" :visible.sync="dialogAuthorizeVisible" @cancel="closeAuthorizeDialog">
      <group-authorize :groupId="currentId" @closeAuthorizeDialog="closeAuthorizeDialog" ref="groupAuthorize"></group-authorize>
    </a-modal>
  </a-row>
</template>

<script>
import {
  fetchTree,
  getObj,
  addObj,
  delObj,
  putObj
} from '@/api/admin/group/index'
import { mapGetters } from 'vuex'
export default {
  name: 'GroupDetail',
  components: {
    'group-user': () => import('./groupUser'),
    'group-authority': () => import('./groupAuthority'),
    'group-authorize': () => import('./groupAuthorize')
  },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    type: {
      default: '1'
    }
  },
  data () {
    return {
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      dialogUserVisible: false,
      dialogUserName: '关联用户',
      dialogAuthorityVisible: false,
      dialogAuthorityName: '关联资源',
      dialogAuthorizeVisible: false,
      dialogAuthorizeName: '权限下发',
      listQuery: {
        groupType: this.type,
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      groupManager_btn_edit: false,
      groupManager_btn_del: false,
      groupManager_btn_add: false,
      groupManager_btn_userManager: false,
      groupManager_btn_resourceManager: false,
      groupManager_btn_authorizeManager: false,
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      currentId: -1
    }
  },
  watch: {
    filterText (val) {
      this.$refs.groupTree.filter(val)
    }
  },
  created () {
    this.getList()
    this.groupManager_btn_edit = this.elements['groupManager:btn_edit']
    this.groupManager_btn_del = this.elements['groupManager:btn_del']
    this.groupManager_btn_add = this.elements['groupManager:btn_add']
    this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager']
    this.groupManager_btn_resourceManager = this.elements['groupManager:btn_resourceManager']
    this.groupManager_btn_authorizeManager = this.elements['groupManager:btn_authorizeManager']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
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
      const { $confirm, $notification, currentId, getList, onCancel } = this
      $confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续? ?',
        onOk () {
          delObj(currentId).then(() => {
            getList()
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
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          putObj(this.form.id, this.form).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    onCancel () {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm () {
      this.form = {
        parentId: this.currentId,
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      }
    },
    handlerUser () {
      this.dialogUserVisible = true
      if (this.$refs.groupUser !== undefined) {
        this.$refs.groupUser.groupId = this.currentId
        this.$refs.groupUser.initUsers()
      }
    },
    handlerAuthority () {
      this.dialogAuthorityVisible = true
      if (this.$refs.groupAuthority !== undefined) {
        this.$refs.groupAuthority.groupId = this.currentId
        this.$refs.groupAuthority.initAuthoritys()
      }
    },
    handlerAuthorize () {
      this.dialogAuthorizeVisible = true
      if (this.$refs.groupAuthorize !== undefined) {
        this.$refs.groupAuthorize.groupId = this.currentId
        this.$refs.groupAuthorize.initAuthoritys()
      }
    },
    closeAuthorizeDialog () {
      this.dialogAuthorizeVisible = false
    },
    closeUserDialog () {
      this.dialogUserVisible = false
    },
    closeAuthorityDialog () {
      this.dialogAuthorityVisible = false
    }
  }
}
</script>
