<template>
  <div class="app-container calendar-list-container">
    <a-row :gutter="8">
      <a-col :span="6">
        <div class="grid-content bg-purple" style="margin-right: 10px">
          <a-card :bordered="false" title="字典目录" >
            <a-input
              style="margin-bottom: 10px"
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </a-input>
            <el-tree
              class="filter-tree"
              node-key="id"
              :data="dictTypeData"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="dictTypeTree"
              @node-click="getNodeData"
              highlight-current
              :render-content="renderContent">
            </el-tree>
          </a-card>
        </div>
      </a-col>
      <a-col :span="18" style="height:100%"><div class="grid-content bg-purple-light">
        <a-card :bordered="false" title="字典数据" v-if="!editDictTypeFlag" >
          <div>
            <div class="filter-container" style="margin-bottom: 15px">
              <a-input-search
                @keyup.enter.native="handleDictValueFilter"
                style="width: 200px;"
                placeholder="标签或code"
                v-model="listDictValueQuery.labelDefault"
                @search="handleDictValueFilter()"
                enterButton></a-input-search>
              <a-button class="filter-item" style="margin-left: 10px;" @click="handleDictValueCreate" type="primary" v-if="this.dictValueManager_btn_add">添加</a-button>
            </div>
            <el-table :data="dictValueTableData" border highlight-current-row style="width: 100%">
              <el-table-column
                label="操作"
                align="center"
                width="80px">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="dictValueManager_btn_edit"><i class="el-icon-edit"></i></el-button>
                  <el-button size="small" type="text" @click="handleDelete(scope.row)" style="color: red" v-if="dictValueManager_btn_del"><i class="el-icon-delete"></i>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column width="200px" align="center" label="编码">
                <template slot-scope="scope">
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="值">
                <template slot-scope="scope">
                  <span>{{ scope.row.value }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="默认显示">
                <template slot-scope="scope">
                  <span>{{ scope.row.labelDefault }}</span>
                </template>
              </el-table-column>
              <el-table-column width="85px" align="center" label="排序">
                <template slot-scope="scope">
                  <span>{{ scope.row.orderNum }}</span>
                </template>
              </el-table-column>
              <el-table-column width="200px" align="center" label="英文显示">
                <template slot-scope="scope">
                  <span>{{ scope.row.labelEnUs }}</span>
                </template>
              </el-table-column>
              <el-table-column width="200px" align="center" label="中文显示">
                <template slot-scope="scope">
                  <span>{{ scope.row.labelZhCh }}</span>
                </template>
              </el-table-column>

            </el-table>
          </div></a-card>
        <a-card :bordered="false" title="字典编辑" v-if="editDictTypeFlag" >
          <div>
            <!-- 表单提交 -->
            <el-form
              :model="dictTypeForm"
              status-icon
              :rules="dictTypeFormRules"
              ref="dictTypeForm"
              label-width="100px"
              class="demo-ruleForm">
              <el-form-item label="编码" prop="code">
                <a-input v-model="dictTypeForm.code" placeholder="请输入编码">
                </a-input>
              </el-form-item>
              <el-form-item label="目录名" prop="name">
                <a-input v-model="dictTypeForm.name" placeholder="请输入目录名"></a-input>
              </el-form-item>
              <el-form-item>
                <a-button type="primary" @click="handlerDictTypeForm('dictTypeForm')" v-if="this.dictTypeManager_btn_edit">提交</a-button>
                <a-button @click="editDictTypeFlag = false" style="margin-left: 10px">取消</a-button>
              </el-form-item>
            </el-form>
          </div></a-card>
      </div></a-col>
    </a-row>
    <a-modal
      title="提示"
      @cancel="handleDictValueCancel"
      :visible.sync="dictValueDialogVisible"
      width="30%"
      center>
      <!-- 表单提交 -->
      <el-form :model="dictValueForm" :rules="dictValueFormRules" ref="dictValueForm" label-width="100px">
        <el-form-item label="编码值" prop="code">
          <a-input
            :addonBefore="currentDictType.code+'_'"
            v-model="dictValueForm.code"
            placeholder="请输入值"></a-input>
        </el-form-item>
        <el-form-item label="默认显示" prop="labelDefault">
          <a-input v-model="dictValueForm.labelDefault" placeholder="请输入默认显示"></a-input>
        </el-form-item>
        <el-form-item label="英文显示" prop="labelEnUs">
          <a-input v-model="dictValueForm.labelEnUs" placeholder="请输入英文显示"></a-input>
        </el-form-item>
        <el-form-item label="中文显示" prop="labelZhCh">
          <a-input v-model="dictValueForm.labelZhCh" placeholder="请输入中文显示"></a-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <a-input v-model="dictValueForm.orderNum" placeholder="请输入排序"></a-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a-button @click="handleDictValueCancel" style="margin-right: 10px">取 消</a-button>
        <a-button type="primary" @click="handleDictValueSave('dictValueForm')">确 定</a-button>
      </span>
    </a-modal>
  </div>
</template>

<script>
import {
  getTree,
  addTypeObj,
  getTypeObj,
  delTypeObj,
  putTypeObj
} from '@/api/dict/dictType/index'
import {
  page,
  addValueObj,
  delValueObj,
  putValueObj
} from '@/api/dict/dictValue/index'
import { mapGetters } from 'vuex'
export default {
  watch: {
    filterText (val) {
      this.$refs.dictTypeTree.filter(val)
    }
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleClick (row) {
      this.dictValueDialogVisible = true
      const { ...obj } = row
      this.dictValueForm = obj
      if (this.dictValueForm.code.indexOf(this.currentDictType.code) > -1) {
        this.dictValueForm.code = this.dictValueForm.code.substring(this.currentDictType.code.length + 1, this.dictValueForm.code.length)
      }
    },
    handleDelete (row) {
      const { $confirm, $notification, dictValueTableData } = this
      $confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续? ?',
        onOk () {
          delValueObj(row.id).then(() => {
            $notification['success']({
              message: '提示',
              description: '删除成功',
              duration: 8
            })
            const index = dictValueTableData.indexOf(row)
            dictValueTableData.splice(index, 1)
          })
        },
        onCancel () {
        }
      })
    },
    handleDictValueFilter () {
      this.listDictValueQuery.typeId = this.currentDictTypeId
      page(this.listDictValueQuery).then(response => {
        this.dictValueTableData = response.data.rows
      })
    },
    handleDictValueSave (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          if (this.dictValueForm.id !== undefined) {
            this.dictValueForm.value = this.dictValueForm.code
            this.dictValueForm.code = this.currentDictType.code + '_' + this.dictValueForm.code
            putValueObj(this.dictValueForm.id, this.dictValueForm).then(() => {
              this.editDictTypeFlag = false
              this.handleDictValueFilter()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dictValueDialogVisible = false
            })
          } else {
            this.dictValueForm.value = this.dictValueForm.code
            this.dictValueForm.code = this.currentDictType.code + '_' + this.dictValueForm.code
            this.dictValueForm.typeId = this.currentDictTypeId
            addValueObj(this.dictValueForm).then(() => {
              this.editDictTypeFlag = false
              this.handleDictValueFilter()
              this.$notification['success']({
                message: '提示',
                description: '添加成功',
                duration: 8
              })
              this.dictValueDialogVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    handleDictValueCreate () {
      if (this.currentDictTypeId === undefined) {
        this.$notification['error']({
          message: '提示',
          description: '请先选择字典目录',
          duration: 8
        })
      } else {
        this.dictValueDialogVisible = true
        this.resetDictValueForm()
      }
    },
    handleDictValueCancel () {
      this.dictValueDialogVisible = false
      this.resetDictValueForm()
    },
    handlerDictTypeForm (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          putTypeObj(this.dictTypeForm.id, this.dictTypeForm).then(() => {
            this.editDictTypeFlag = false
            this.initTreeData()
            this.$notification['success']({
              message: '提示',
              description: '修改成功',
              duration: 8
            })
          })
        } else {
          return false
        }
      })
    },
    append (node, data) {
      let entity = {}
      addTypeObj({ name: '子节点', code: data.code + '_tmp', parentId: data.id }).then(response => {
        entity = response.data
        const newChild = { id: entity.id, label: entity.name, children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      })
      this.$refs.dictTypeTree.setCurrentKey(data.id)
    },
    remove (node, data) {
      if (data.children.length > 0) {
        this.$notification['error']({
          message: '提示',
          description: '删除失败',
          duration: 8
        })
        return
      }
      const query = {
        typeId: this.currentDictTypeId
      }
      page(query).then(response => {
        this.dictValueTableData = response.data.rows
        if (this.dictValueTableData.length > 0) {
          this.$notification['error']({
            message: '失败',
            description: '删除失败，该项有字典值！',
            duration: 8
          })
          return
        }
        delTypeObj(data.id).then(() => {
          this.$notification['success']({
            message: '提示',
            description: '删除成功',
            duration: 8
          })
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        })
        this.$refs.dictTypeTree.setCurrentKey(data.id)
      })
    },
    edit (node, data) {
      this.editDictTypeFlag = true
      this.currentDictTypeId = data.id
      this.currentDictType = data
      getTypeObj(data.id).then(response => {
        this.dictTypeForm = response.data
      })
      this.$refs.dictTypeTree.setCurrentKey(data.id)
    },
    resetDictTypeForm () {
      this.dictTypeForm = {
        code: '',
        name: ''
      }
    },
    resetDictValueForm () {
      this.dictValueForm = {
        code: undefined,
        labelDefault: undefined,
        labelEnUs: undefined,
        labelZhCh: undefined,
        value: undefined
      }
    },
    renderContent (h, { node, data }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" >
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            {this.dictTypeManager_btn_edit
              ? <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.edit(node, data)}
              >
                <i class="el-icon-edit" />
              </el-button> : <span></span>
            }
            {this.dictTypeManager_btn_add
              ? <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.append(node, data)}
              >
                <i class="el-icon-circle-plus-outline" />
              </el-button>
              : <span></span>
            }
            {this.dictTypeManager_btn_del
              ? <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.remove(node, data)}
              >
                <i class="el-icon-delete" />
              </el-button>
              : <span></span>
            }
          </span>
        </span>
      )
    },
    initTreeData () {
      getTree().then(data => {
        this.dictTypeData = data
      })
    },
    getNodeData (data) {
      this.currentDictTypeId = data.id
      this.currentDictType = data
      const query = {
        typeId: this.currentDictTypeId
      }
      page(query).then(response => {
        this.dictValueTableData = response.data.rows
      })
    }
  },
  created () {
    this.initTreeData()
    // 加载树
    this.dictTypeManager_btn_edit = this.elements['dictTypeManager:btn_edit']
    this.dictTypeManager_btn_del = this.elements['dictTypeManager:btn_del']
    this.dictTypeManager_btn_add = this.elements['dictTypeManager:btn_add']
    this.dictValueManager_btn_edit = this.elements['dictValueManager:btn_edit']
    this.dictValueManager_btn_del = this.elements['dictValueManager:btn_del']
    this.dictValueManager_btn_add = this.elements['dictValueManager:btn_add']
  },
  computed: {
    ...mapGetters(['elements'])
  },
  data () {
    return {
      dictValueManager_btn_edit: false,
      dictValueManager_btn_del: false,
      dictValueManager_btn_add: false,
      dictTypeManager_btn_edit: false,
      dictTypeManager_btn_del: false,
      dictTypeManager_btn_add: false,
      filterText: '',
      dictValueDialogVisible: false,
      editDictTypeFlag: false,
      currentDictTypeId: undefined,
      currentDictType: {},
      dictTypeForm: {
        code: '',
        name: ''
      },
      listDictValueQuery: {
        labelDefault: undefined,
        typeId: undefined
      },
      dictValueForm: {
        code: undefined,
        labelDefault: undefined,
        labelEnUs: undefined,
        labelZhCh: undefined,
        value: undefined
      },
      dictValueFormRules: {
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        labelDefault: [
          {
            required: true,
            message: '请输入默认显示',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        labelEnUs: [
          {
            required: true,
            message: '请输入英文显示',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        labelZhCh: [
          {
            required: true,
            message: '请输入中文显示',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      dictTypeFormRules: {
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入目录名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      dictTypeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dictValueTableData: []
    }
  }
}
</script>
