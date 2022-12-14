import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App,URLOpenListenerEvent } from '@capacitor/app';
window['Capacitor']['Plugins'].App = App;
import { Capacitor } from '@capacitor/core';
import * as Keycloak from 'keycloak-ionic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-to-ionic';
  public keycloak: Keycloak.KeycloakInstance;
  public authSuccess: boolean = false;
  public userProfile: Keycloak.KeycloakProfile = {};
authResponse: any;

  constructor(private changeRef: ChangeDetectorRef,private router: Router, private zone: NgZone){
    window['Capacitor']['Plugins'].App = App;
    this.initializeApp();
  }

  ngOnInit(): void {
    let isNative = Capacitor.isNativePlatform();

    this.keycloak = Keycloak({
      clientId: 'angular-ionic',
      realm: 'angular-ionic',
      url: 'http://152.69.187.51:443/auth'
  });
  this.keycloak.init({
      adapter: 'capacitor-native',
      responseMode: 'query',
      redirectUri: 'https://angular-to-ionic.vercel.app/'
  });
  console.log(' isNative', isNative);

  // Test if it works, when coming back from this.keycloak.login();
  this.keycloak.onAuthSuccess = () => {
    this.authSuccess = true;
      console.log('authenticated!');
      this.authResponse = 'authenticated!'
      this.changeRef.detectChanges();
  };

  this.keycloak.onAuthError = (err) => {
    this.authResponse = err
  };

  this.keycloak.onAuthLogout = () => {
    console.log('logout');
    this.authSuccess = false;
    this.userProfile = {};
    this.changeRef.detectChanges();
  };
  }

  login(): void {
    this.keycloak.login();
  }

  loadProfile(): void {
    this.keycloak.loadUserProfile().then(profile => {
      this.userProfile = profile;
      this.changeRef.detectChanges();
    });
  }

  logout() {
    this.keycloak.logout();
  }

  initializeApp() {
		App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
			this.zone.run(() => {
				const domain = 'angular-to-ionic.vercel.app';

				const pathArray = event.url.split(domain);
				// The pathArray is now like ['https://devdactic.com', '/details/42']

				// Get the last element with pop()
				const appPath = pathArray.pop();
				if (appPath) {
					this.router.navigateByUrl(appPath);
				}
			});
		});
	}

}
