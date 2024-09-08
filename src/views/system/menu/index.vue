<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
          <el-option label="启用" value="0" />
          <el-option label="禁用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="initPage" />
    </el-row>

    <el-table
      v-if="refreshTable"
      ref="menuTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      lazy="lazy"
      :load="load"
      :default-expand-all="isExpandAll"
      :tree-props="{ hasChildren: 'hasChildren', children: 'children' }"
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" min-width="160">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
          <span style="margin-left:4px;">{{ scope.row.menuName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" label="菜单类型" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuType === 'M'" size="small" type="warning">目录</el-tag>
          <el-tag v-if="scope.row.menuType === 'C'" size="small">菜单</el-tag>
          <el-tag v-if="scope.row.menuType === 'F'" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sortNo" label="排序" min-width="60" align="center" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" align="center" min-width="180px" />
      <el-table-column prop="accessCode" label="权限标识" :show-overflow-tooltip="true" align="center" min-width="180px" />
      <el-table-column prop="status" label="状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="small" type="success">正常</el-tag>
          <el-tag v-else size="small" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" min-width="160px" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="190px" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-if="scope.row.menuType !== 'F'"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :disabled="disabledTree"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
                @select="changeParentId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <template v-if="form.menuType === 'M'">
                  <el-radio label="M">目录</el-radio>
                  <el-radio label="C">菜单</el-radio>
                </template>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'F'" :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="margin-top: 4px;height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortNo">
              <el-input-number v-model="form.sortNo" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'F'" :span="12">
            <el-form-item prop="isFrame">
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                是否外链
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'F'" :span="12">
            <el-form-item prop="url">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.url" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType === 'C'" :span="12">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'M'" :span="12">
            <el-form-item prop="accessCode">
              <el-input v-model="form.accessCode" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType === 'C'" :span="12">
            <el-form-item prop="query">
              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              <span slot="label">
                <el-tooltip content="访问路由的默认传递参数，如：`{&quot;id&quot;: 1, &quot;name&quot;: &quot;ry&quot;}`" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                路由参数
              </span>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType === 'C'" :span="12">
            <el-form-item prop="isCache">
              <span slot="label">
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                是否缓存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio :label="0">缓存</el-radio>
                <el-radio :label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'F'" :span="12">
            <el-form-item prop="visible">
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                显示状态
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio key="1" :label="0">显示</el-radio>
                <el-radio key="2" :label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'F'" :span="12">
            <el-form-item prop="status">
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.status">
                <el-radio key="0" :label="0">启用</el-radio>
                <el-radio key="1" :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
import { getMenuList, getMenuTree, addMenu, updateMenu, delMenu } from '@/api/system/menu'

export default {
  name: 'Menu',
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      disabledTree: false,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      lazy: true,
      maps: new Map(),
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initPage()
  },
  mounted() {
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    // 页面初始化数据
    async initPage() {
      this.loading = true
      // const menuList = await this.getList({ menuId: 0 })
      // this.menuList = menuList
      this.loading = false
    },
    // 查询菜单列表
    getList(params) {
      return new Promise((resolve, reject) => {
        getMenuList(params).then(res => {
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    // Table懒加载
    async load(tree, treeNode, resolve) {
      const res = await this.getList({ menuId: tree.id })
      resolve(res)
    },
    // 数据更新后，重新加载节点
    reloadNode(parentId) {
      if (parentId === 0) {
        // 当为最外层目录时，不用懒加载方式更新节点
        this.initPage()
      } else {
        const { lazyTreeNodeMap, treeData } = this.$refs.menuTable.store.states
        this.$set(lazyTreeNodeMap, parentId, [])
        this.load({ id: parentId }, null, data => {
          if (treeData[parentId]) {
            this.$set(treeData[parentId], 'loading', false)
            this.$set(treeData[parentId], 'loaded', true)
            // 数据更新后，打开展示
            this.$set(treeData[parentId], 'expanded', true)
          }
          if (data.length) {
            this.$set(lazyTreeNodeMap, parentId, data)
          } else {
            treeData[parentId].hasChildren = false
          }
        })
      }
    },
    // 转换菜单数据结构
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children
      }
    },
    // 查询菜单下拉树结构
    getTreeselect() {
      getMenuTree().then(res => {
        this.menuOptions = [
          { id: 0, menuName: '主类目', menuType: 'M', children: res }
        ]
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.disabledTree = false
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: 'M',
        orderNum: undefined,
        isFrame: 0,
        isCache: 0,
        visible: 0,
        status: 0
      }
      this.resetForm('form')
    },
    // 搜索按钮操作
    async handleQuery() {
      const menuList = await this.getList(this.queryParams)
      this.menuList = menuList
    },
    // 重置按钮操作
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 新增按钮操作
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null && row.id) {
        this.disabledTree = true
        this.form.parentId = row.id
        this.form.menuType = row.menuType
      }
      this.open = true
      this.title = '添加菜单'
    },
    // 修改上级菜单时，重新设置父级菜单id和父级菜单类型
    changeParentId(node) {
      this.form.parentId = node.id
      this.form.menuType = node.menuType
    },
    // 展开/折叠操作
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 修改按钮操作
    handleUpdate(row) {
      const formData = JSON.parse(JSON.stringify(row))
      this.reset()
      this.getTreeselect()
      // 修改操作需要记录初始父级菜单ID，上级菜单改变时，需要用初始父级菜单ID来刷新页面数据
      this.form = { ...this.form, ...formData, oldParentId: formData.parentId }
      this.open = true
      this.title = '修改菜单'
    },
    // 提交按钮
    submitForm() {
      const row = JSON.parse(JSON.stringify(this.form))
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (row.id) {
            updateMenu(row).then(res => {
              this.$modal.msgSuccess('修改成功')
              // 当父级菜单发生改变时，需要刷新之前父级菜单下的子菜单
              if (row.oldParentId !== row.parentId) {
                this.reloadNode(row.oldParentId)
              }
              this.reloadNode(row.parentId)
              this.open = false
            })
          } else {
            addMenu(row).then(res => {
              this.$modal.msgSuccess('新增成功')
              this.reloadNode(row.parentId)
              this.open = false
            })
          }
        }
      })
    },
    // 删除按钮操作
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.menuName + '"的数据项？').then(function() {
        return delMenu(row.id)
      }).then(() => {
        this.$modal.msgSuccess('删除成功')
        if (row.parentId === 0) {
          // 重新查询一级数据
          this.initPage()
        } else {
          this.reloadNode(row.parentId)
        }
      }).catch(() => {})
    }
  }
}
</script>
<style lang='scss' scoped>
/* @import url(); 引入css类 */

</style>
