import { Component, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // User information
  userName: string = 'Tui là who';
  userRole: string = 'Quản lý';

  // Search
  searchQuery: string = '';

  // Notifications
  // Notifications
  notifications = [
    {
      title: 'Tồn kho thấp',
      message: 'Nguyên liệu Sữa tươi chỉ còn 5 đơn vị. Cần nhập thêm.',
      time: '1 giờ trước',
      type: 'warning',
      read: false
    },
    {
      title: 'Sắp hết hạn',
      message: 'Nguyên liệu Trân châu sẽ hết hạn trong 2 ngày.',
      time: '5 giờ trước',
      type: 'danger',
      read: false
    },
    {
      title: 'Nhập kho thành công',
      message: 'Phiếu nhập #NK045 đã hoàn tất.',
      time: '1 ngày trước',
      type: 'success',
      read: true
    }
  ];

  get unreadNotifications(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // UI state
  isUserMenuOpen: boolean = false;
  isNotificationsOpen: boolean = false;
  isSidebarOpen: boolean = true;
  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(private router: Router, private el: ElementRef) { }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
      this.isNotificationsOpen = false;
    }
  }

  // Toggle sidebar (will be implemented with sidebar component)
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggle.emit(this.isSidebarOpen);
    console.log('Toggle sidebar');
  }

  // Search functionality
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search logic here
      // this.router.navigate(['/admin/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  // Toggle user menu dropdown
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) {
      this.isNotificationsOpen = false;
    }
  }

  // Toggle notifications
  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.isUserMenuOpen = false;
    }
  }

  // Navigate to help page
  navigateToHelp(): void {
    console.log('Navigate to help');
    // this.router.navigate(['/admin/help']);
  }

  // Navigate to feedback page
  navigateToFeedback(): void {
    console.log('Navigate to feedback');
    // this.router.navigate(['/admin/feedback']);
  }

  // Logout
  logout(): void {
    console.log('Logging out...');
    // Implement logout logic here
    // Clear session/token
    // this.router.navigate(['/login']);
  }

  // Close dropdowns when clicking outside
  closeDropdowns(): void {
    this.isUserMenuOpen = false;
    this.isNotificationsOpen = false;
  }
}
