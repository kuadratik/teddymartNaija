import CustomButton from '@/components/SharedUI/Buttons/Button'
import PlannerModal from '@/components/SharedUI/PlannerModal'
import SEOHead from '@/components/SharedUI/SEOHead'
import Spinner from '@/components/SharedUI/Spinner'
import TableMainComponent from '@/components/SharedUI/TableMainComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {SearchIcon, SendIcon} from '@/components/SuperAdmin/icons'
import SuperAdminLayout from '@/components/SuperAdmin/Layout'
import PermissionGuard from '@/components/SuperAdmin/PermissionGuard'
import {userColumns} from '@/components/SuperAdmin/tableColumns'
import UserMobileCardSkeleton from '@/components/SuperAdmin/Users/Skeleton/UserMobileCardSkeleton'
import UserForm from '@/components/SuperAdmin/Users/UserForm'
import UserMobileCard from '@/components/SuperAdmin/Users/UserMobileCard'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'
import {
  useDeleteAdminStaffMutation,
  useGetAdminStaffProfileQuery,
  useGetAllAdminStaffsQuery,
  useGetAllPermissionsQuery
} from '@/services/super-admin/user-management'
import debounce from '@/utils/debounce'
import {capitalizeOnlyFirstLetter, newUserTimeZoneFormatDate} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Dropdown, MenuProps, Pagination} from 'antd'
import Item from 'antd/es/list/Item'
import {useRouter} from 'next/router'
import {useCallback, useState} from 'react'
const userRoles = [
  {label: 'Super Admin', value: 'super-admin'},
  {label: 'Admin', value: 'admin'},
  {label: 'Product manager', value: 'product_manager'}
]
export const handleShowAdminRole = (role: string) => {
  // use userRoles array to find label
  const foundRole = userRoles.find(r => r.value === role)
  return foundRole ? foundRole.label : 'Super Admin'
}
const index = () => {
  const {isAuthenticated, isInitialized} = useSuperAdminAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [isShowModalEdit, setIsShowModalEdit] = useState(false)
  const [isCreateModalView, setIsCreateModalView] = useState(false)
  const {data, isLoading, refetch} = useGetAllAdminStaffsQuery({
    page: currentPage,
    search: searchQuery
  })
  const {data: permissionsData, isLoading: isPermissionsLoading} = useGetAllPermissionsQuery()
  const {data: profileData, isLoading: isProfileLoading} = useGetAdminStaffProfileQuery({})
  const [deleteAdminStaff, {isLoading: isDeleting}] = useDeleteAdminStaffMutation()
  const isSuperAdmin = profileData?.data?.role.toLowerCase() === 'super_admin'
  const items: MenuProps['items'] = [
    {
      label: (
        <button
          onClick={() => {
            router.push(`/super-admin/dashboard/users/${selectedItem?.id}`)
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          View
        </button>
      ),
      key: '0'
    },
    // Only show Edit and Delete if the selected user is NOT a super admin
    ...(selectedItem?.role.toLowerCase() !== 'super_admin'
      ? [
          {
            label: (
              <button
                onClick={() => {
                  setIsShowModalEdit(true)
                }}
                className="flex w-full items-center gap-2"
                type="button"
              >
                Edit
              </button>
            ),
            key: '1'
          },
          {
            label: (
              <button
                onClick={() => {
                  setShowDeleteModal(true)
                }}
                className="flex w-full items-center gap-2 text-red-500"
                type="button"
              >
                Delete
              </button>
            ),
            key: '2'
          }
        ]
      : [])
  ]
  // onlu show super_admin role to super admins
  const filteredItems = isSuperAdmin
    ? data?.data.data
    : data?.data.data.filter((user: any) => user.role.toLowerCase() !== 'super_admin')
  const transformedData = filteredItems?.map((item) => ({
    ...item,
    dateInitiated: newUserTimeZoneFormatDate(item.created_at, 'DD - MM - YYYY'),
    name: <span className="capitalize text-gray-900">{item.first_name + ' ' + item.last_name || ''}</span>,
    email: (
      <a href={`mailto:${item.email}`} className="text-blue-500">
        {item.email || ''}
      </a>
    ),
    role: <span className="text-gray-900 capitalize">{handleShowAdminRole(item.role ? item.role : '') || 'Super Admin'}</span>,
    permissions_no: (
      <div className="flex items-center justify-between gap-2">
        <span className="text-gray-900">{Array.isArray(item?.permissions) ? item.permissions.length : '-'}</span>
        <div className="">
          {isSuperAdmin && (
            <Dropdown menu={{items}} trigger={['click']}>
              <a
                onClick={e => {
                  e.preventDefault()
                  setSelectedItem(item)
                }}
              >
                <Icon icon="bi:three-dots" className="text-2xl" />
              </a>
            </Dropdown>
          )}
        </div>
      </div>
    )
  }))
  const debouncedUpdateURL = useCallback(
    debounce((searchValue: string, pageNumber: number) => {
      const query: {search?: string; page?: number} = {}

      if (searchValue) {
        query.search = searchValue
      }

      if (pageNumber > 1) {
        query.page = pageNumber
      }

      router.replace(
        {
          pathname: '/super-admin/dashboard/users',
          query
        },
        undefined,
        {shallow: true}
      )
    }, 500),
    [router]
  )
  // Handle pagination change
  const handlePaginationChange = (page: number) => {
    setCurrentPage(page)
    debouncedUpdateURL(searchQuery, page)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }
  // Delete user function
  const handleDeleteUser = async () => {
    if (!selectedItem) return
    try {
      await deleteAdminStaff({adminStaffId: selectedItem.id}).unwrap()
      setShowDeleteModal(false)
      refetch()
      // Show success toast after closing
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>User deleted successfully!</>}
              textColor="#FFF"
              message="The User has been deleted."
              backgroundColor="#000"
            />
          )
        },
        message: 'Success'
      })
    } catch (error: any) {
      console.error('Failed to delete user:', error)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  Error Deleting
                  {selectedItem && (
                    <div className="font-semibold capitalize">
                      {selectedItem.first_name + ' ' + selectedItem.last_name}
                    </div>
                  )}
                </>
              }
              textColor="#FFF"
              message={error?.data?.message || 'An error occurred while deleting the user.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Error'
      })
    }
  }

  // Show loading state while checking authentication
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <>
      <SEOHead
        title="Super Admin Dashboard | AfricanDiasporaMart"
        description="Manage and monitor all brands, users, and activities on AfricanDiasporaMart platform"
      />
      <SuperAdminLayout>
        <PermissionGuard permission="manage-users">
          <div className="mb-8 grid grid-cols-2 items-center gap-4 lg:grid-cols-3">
            <div className="w-fit text-[24px] font-semibold leading-6 text-black">User</div>
            <div className="hidden w-full md:w-[400px] lg:block">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-[14px] shadow-sm transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <SendIcon />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              {isSuperAdmin && (
                <CustomButton
                  onClick={() => setIsCreateModalView(true)}
                  className="w-fit rounded-lg bg-black px-5 py-3 text-white"
                >
                  Add User
                </CustomButton>
              )}
            </div>
          </div>
          <div className="relative bottom-3 w-full lg:hidden">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-[14px] shadow-sm transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <SendIcon />
              </div>
            </div>
          </div>
          {/* table view for desktop */}
          <div className="hidden lg:block">
            <TableMainComponent
              transparentRows={true}
              rowOpacity={0.2}
              showScrollButtons={false}
              data={selectedItem}
              formValues={{}}
              refetch={() => {}}
              firstRowClassName="#FFFFFF5C"
              bordered={true}
              deleteRowApi={{}}
              setShowDeleteModal={setShowDeleteModal}
              showDeleteModal={showDeleteModal}
              isDeleteLoading={false}
              isLoading={isLoading}
              DeleteModalComponent={
                <div className="mx-auto flex w-[95%] flex-col items-center justify-center gap-y-2">
                  <>
                    <div className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-[#FFEBEB]">
                      <Icon icon="material-symbols-light:warning-rounded" className="m-auto text-3xl text-[#FF2D55]" />
                    </div>
                    <p className="text-center text-[20px] font-medium text-[#23262F] lg:text-[24px]">
                      Are you sure you want to delete the user,{' '}
                      {selectedItem && (
                        <span className="font-semibold capitalize">
                          {selectedItem.first_name + ' ' + selectedItem.last_name}
                        </span>
                      )}{' '}
                      ?
                    </p>

                    <div className="mt-5 flex w-full gap-x-4">
                      <CustomButton
                        bordered={false}
                        onClick={() => setShowDeleteModal(false)}
                        className="w-full rounded-[10px] bg-[#F1F1F1] py-3.5"
                      >
                        No
                      </CustomButton>
                      <CustomButton
                        bordered={false}
                        onClick={handleDeleteUser}
                        className="rounded-[10px] bg-[#FF2D55] py-3.5 text-white"
                      >
                        {isDeleting ? <Spinner /> : 'Yes,delete'}
                      </CustomButton>
                    </div>
                  </>
                </div>
              }
              transformedData={transformedData}
              DeleteModalText={<>{capitalizeOnlyFirstLetter(selectedItem?.first_name!)}</>}
              deleteSuccessMessage={`${capitalizeOnlyFirstLetter(selectedItem?.first_name!)} deleted successfully`}
              deleteErrorMessage={`${capitalizeOnlyFirstLetter(selectedItem?.first_name!)} deletion failed`}
              columnsTable={userColumns}
            />
          </div>
          {/* card view for mobile */}
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
            {isLoading
              ? Array.from({length: 6}).map((_, index) => <UserMobileCardSkeleton key={index} />)
              : data?.data?.data.map(item => (
                  <UserMobileCard key={item.id} data={item} items={items} setSelectedItem={setSelectedItem} />
                ))}
          </div>
          <div className="flex w-full items-center justify-end pb-10 pt-5 lg:justify-between">
            {(currentPage === 1 && data?.data?.total! >= 10) || (currentPage > 1 && data?.data?.total! >= 1) ? (
              <div className={`hidden text-sm font-[500] text-black lg:block`}>
                Showing {(currentPage - 1) * data?.data.per_page! + 1} to{' '}
                {Math.min(currentPage * data?.data.per_page!, data?.data?.total!)} of {data?.data?.total!} results
              </div>
            ) : null}
            {(currentPage === 1 && data?.data.total! >= 10) || (currentPage > 1 && data?.data.total! >= 1) ? (
              <Pagination
                current={currentPage}
                total={(data as any)?.data?.total!}
                pageSize={data?.data.per_page!}
                showSizeChanger={false}
                onChange={handlePaginationChange}
              />
            ) : null}
          </div>
        </PermissionGuard>
      </SuperAdminLayout>

      {isCreateModalView && (
        <PlannerModal
          title={<span className="text-lg font-semibold text-black">Add New User</span>}
          iconClassName="relative top-1 text-black text-2xl"
          onCloseModal={() => {
            setIsCreateModalView(false)
          }}
          className="rounded-xl"
          modalOpen={isCreateModalView}
          setModalOpen={setIsCreateModalView}
        >
          <UserForm
            isEditing={false}
            refetch={refetch}
            onCloseModal={() => {
              setIsCreateModalView(false)
            }}
            isPermissionsLoading={isPermissionsLoading}
            permissionsData={permissionsData}
          />
        </PlannerModal>
      )}
      {isShowModalEdit && (
        <PlannerModal
          title={<span className="text-lg font-semibold text-black">Edit User</span>}
          iconClassName="relative top-1 text-black text-2xl"
          onCloseModal={() => {
            setIsShowModalEdit(false)
          }}
          className="rounded-xl"
          modalOpen={isShowModalEdit}
          setModalOpen={setIsShowModalEdit}
        >
          <UserForm
            isEditing={true}
            userId={selectedItem?.id || ''}
            userData={selectedItem}
            refetch={refetch}
            onCloseModal={() => setIsShowModalEdit(false)}
            isPermissionsLoading={isPermissionsLoading}
            permissionsData={permissionsData}
          />
        </PlannerModal>
      )}
    </>
  )
}

export default index
