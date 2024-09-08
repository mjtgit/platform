<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" size="small" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              placeholder="请输入用户名称"
              clearable
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              placeholder="请输入手机号码"
              clearable
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              style="width: 240px"
            >
              <el-option label="正常" value="123" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
            >搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini">重置</el-button>
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
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
        </el-row>

        <el-table :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            v-if="columns[0].visible"
            key="userId"
            label="用户编号"
            align="center"
            prop="userId"
          />
          <el-table-column
            v-if="columns[1].visible"
            key="userName"
            label="用户名称"
            align="center"
            prop="userName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            v-if="columns[2].visible"
            key="nickName"
            label="用户昵称"
            align="center"
            prop="nickName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            v-if="columns[3].visible"
            key="deptName"
            label="部门"
            align="center"
            prop="dept.deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            v-if="columns[4].visible"
            key="phonenumber"
            label="手机号码"
            align="center"
            prop="phonenumber"
            width="120"
          />
          <el-table-column
            v-if="columns[5].visible"
            key="status"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns[6].visible"
            label="创建时间"
            align="center"
            prop="createTime"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template v-if="scope.row.userId !== 1" slot-scope="scope">
              <el-dropdown
                size="mini"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon-menu" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="handleUpdate(scope.row)"
                    icon="el-icon-edit"
                  >修改</el-dropdown-item>
                  <el-dropdown-item
                    command="handleDelete(scope.row)"
                    icon="el-icon-delete"
                  >删除</el-dropdown-item>

                  <el-dropdown-item
                    command="handleResetPwd"
                    icon="el-icon-key"
                  >重置密码</el-dropdown-item>
                  <el-dropdown-item
                    command="handleAuthRole"
                    icon="el-icon-circle-check"
                  >分配角色</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      deptOptions: [
        {
          id: 100,
          label: '若依科技',
          children: [
            {
              id: 101,
              label: '深圳总公司',
              children: [
                {
                  id: 103,
                  label: '研发部门'
                },
                {
                  id: 104,
                  label: '市场部门'
                },
                {
                  id: 105,
                  label: '测试部门'
                },
                {
                  id: 106,
                  label: '财务部门'
                },
                {
                  id: 107,
                  label: '运维部门'
                }
              ]
            },
            {
              id: 102,
              label: '长沙分公司',
              children: [
                {
                  id: 108,
                  label: '市场部门'
                },
                {
                  id: 109,
                  label: '财务部门'
                }
              ]
            }
          ]
        }
      ],
      // 总条数
      total: 2,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 非多个禁用
      multiple: true,
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      userList: [
        {
          searchValue: null,
          createBy: 'admin',
          createTime: '2022-08-01 12:00:20',
          updateBy: null,
          updateTime: null,
          remark: '管理员',
          params: {},
          userId: 1,
          deptId: 103,
          userName: 'admin',
          nickName: 'admin',
          email: 'ry@163.com',
          phonenumber: '15888888888',
          sex: '1',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '221.226.135.114',
          loginDate: '2022-09-26T10:02:23.000+08:00',
          dept: {
            searchValue: null,
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            params: {},
            deptId: 103,
            parentId: null,
            ancestors: null,
            deptName: '研发部门',
            orderNum: null,
            leader: '若依',
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: true
        },
        {
          searchValue: null,
          createBy: 'admin',
          createTime: '2022-08-01 12:00:21',
          updateBy: null,
          updateTime: null,
          remark: '测试员',
          params: {},
          userId: 2,
          deptId: 105,
          userName: 'test',
          nickName: 'test',
          email: 'test@qq.com',
          phonenumber: '15666666666',
          sex: '1',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '59.46.22.14',
          loginDate: '2022-09-26T09:42:24.000+08:00',
          dept: {
            searchValue: null,
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            params: {},
            deptId: 105,
            parentId: null,
            ancestors: null,
            deptName: '测试部门',
            orderNum: null,
            leader: '若依',
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
    /** 查询用户列表 */
    getList() {
      const that = this
      that.loading = true
      setTimeout(() => {
        that.loading = false
      }, 1000)
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      // this.handleQuery()
    },
    handleAdd() {},
    handleDelete() {},
    handleStatusChange() {},
    handleSelectionChange() {}
  }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
