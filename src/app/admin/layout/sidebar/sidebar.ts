import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  expanded?: boolean;
  active?: boolean;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() isCollapsed: boolean = false;

  menuItems: MenuItem[] = [
    {
      title: 'Tổng quan',
      icon: 'home.png',
      route: '/admin/dashboard',
      active: true
    },
    {
      title: 'Báo cáo',
      icon: 'report.png',
      expanded: false,
      subItems: [
        { title: 'Báo cáo Doanh thu', route: '/admin/reports/revenue' },
        { title: 'Báo cáo Kho hàng', route: '/admin/reports/warehouse' },
        { title: 'Báo cáo Sản Phẩm', route: '/admin/reports/products' }
      ]
    },
    {
      title: 'Hóa đơn',
      icon: 'invoice.png',
      route: '/admin/invoices'
    },
    {
      title: 'Sản phẩm',
      icon: 'product.png',
      expanded: false,
      subItems: [
        { title: 'Thực đơn', route: '/admin/products/menu' },
        { title: 'Danh mục', route: '/admin/products/categories' }
      ]
    },
    {
      title: 'Nhân viên',
      icon: 'staff.png',
      expanded: false,
      subItems: [
        { title: 'Danh sách nhân viên', route: '/admin/employees/list' },
        { title: 'Vai trò', route: '/admin/employees/roles' }
      ]
    },
    {
      title: 'Kho hàng',
      icon: 'warehouse.png',
      expanded: false,
      subItems: [
        { title: 'Danh sách nguyên liệu', route: '/admin/warehouse/materials' },
        { title: 'Nhập kho', route: '/admin/warehouse/import' },
        { title: 'Xuất kho', route: '/admin/warehouse/export' },
        { title: 'Lịch sử kho', route: '/admin/warehouse/history' }
      ]
    }
  ];

  settingsItem: MenuItem = {
    title: 'Thiết lập',
    icon: 'setting.png',
    route: '/admin/settings'
  };

  toggleSubmenu(item: MenuItem): void {
    if (item.subItems) {
      const isCurrentlyExpanded = item.expanded;

      // Close all other submenus
      this.menuItems.forEach(i => {
        if (i !== item) {
          i.expanded = false;
        }
      });

      // Toggle the clicked one
      item.expanded = !isCurrentlyExpanded;
      this.setActive(item);
    } else {
      // Close all submenus when a simple item is clicked
      this.menuItems.forEach(i => i.expanded = false);
      this.setActive(item);
    }
  }

  setActive(item: MenuItem): void {
    this.menuItems.forEach(i => {
      i.active = false;
      if (i.subItems) {
        i.subItems.forEach(sub => sub.active = false);
      }
    });
    if (this.settingsItem) {
      this.settingsItem.active = false;
    }
    item.active = true;
  }

  setSubActive(parent: MenuItem, subItem: SubMenuItem): void {
    this.menuItems.forEach(item => {
      item.active = false;
      if (item.subItems) {
        item.subItems.forEach(sub => sub.active = false);
      }
    });

    if (this.settingsItem) {
      this.settingsItem.active = false;
    }

    parent.active = true;
    subItem.active = true;
  }
}
