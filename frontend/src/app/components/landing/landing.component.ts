import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  title = 'CustomerX Cloud';
  features = [
    { title: 'Easy Management', desc: 'Manage your customers with a beautiful, intuitive interface.', icon: '👥' },
    { title: 'Secure Access', desc: 'Enterprise-grade security with Microsoft Entra ID integration.', icon: '🛡️' },
    { title: 'Fast Results', desc: 'Real-time updates and lightning-fast backend response.', icon: '⚡' }
  ];
}
