import { AfterViewInit, Component, DestroyRef, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map } from 'rxjs';
import { selectAllActivities } from '../store/activities.selectors';
import { Activity } from '../activities.models';

declare const L: any;

@Component({
  imports: [],
  selector: 'app-map',
  templateUrl: './map.html',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  private map: any;
  private markersLayer = L.featureGroup();

  private readonly defaultCenter: [number, number] = [44.8125, 20.4612];
  private readonly defaultZoom = 13;

  private locations$ = this.store.select(selectAllActivities).pipe(
    map((activities: Activity[] | null | undefined) =>
      (activities ?? []).filter(
        (a) => a.latitude != null && a.longitude != null
        )
      ),
      distinctUntilChanged()
  );

  ngAfterViewInit(): void {
    this.initMap();

    this.locations$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((locations) => this.renderMarkers(locations));
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: false,
    }).setView(this.defaultCenter, this.defaultZoom);

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google Maps',
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    L.control
      .fullscreen({
        position: 'topright',
        title: 'Enter fullscreen mode',
        titleCancel: 'Exit fullscreen mode',
      })
      .addTo(this.map);

    const miniMapLayer = L.tileLayer(
      'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 19,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    new L.Control.MiniMap(miniMapLayer, {
      position: 'bottomleft',
      toggleDisplay: true,
      minimized: false,
      width: 110,
      height: 110,
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  private renderMarkers(locations: Activity[]): void {
    this.markersLayer.clearLayers();

    if (locations.length === 0) {
      this.map.setView(this.defaultCenter, this.defaultZoom);
      return;
    }

    locations.forEach((loc) => {
      const marker = L.marker([loc.latitude, loc.longitude]);
      marker.bindPopup(loc.name);

      this.markersLayer.addLayer(marker);
    });

    this.map.fitBounds(this.markersLayer.getBounds(), {
      padding: [40, 40],
      maxZoom: 16,
    });
  }
}