import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit, OnDestroy {

    @ViewChild('drawer', {static: false}) sideNav: MatSidenav;
    private routeSubscription: Subscription;
    private handsetSubscription: Subscription;
    private isHandset: boolean;

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    constructor(private breakpointObserver: BreakpointObserver,
        private router: Router) {}

    ngOnInit() {
        this.isHandset = false;

        this.handsetSubscription = this.isHandset$.subscribe(handset => {
            if(handset) {
                this.isHandset = true;
            } else {
                this.isHandset = false;
            }
        })

        this.routeSubscription = this.router.events.subscribe(event => {
            if(this.isHandset)
                this.sideNav.close();
        });
    }

    ngOnDestroy() {
        this.handsetSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }
}
