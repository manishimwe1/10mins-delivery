import React from 'react'
import Header from './admin/_components/Header'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="admin-layout">
      <Header/>
      <main className="admin-main">{children}</main>
      {/* <footer className="admin-footer">
        <p>© 2023 Admin Panel</p>
      </footer> */}
    </div>
  )
}

export default AdminLayout
