import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-slideshow-backdrop',
  templateUrl: './slideshow-backdrop.component.html',
  styleUrls: ['./slideshow-backdrop.component.scss'],
})
export class SlideshowBackdropComponent implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;

  @Input() promos: [];
  @Output() clickPost = new EventEmitter();

  slidesOptions = {
    initialSlide: 0,
    direction: 'horizontal',
    speed: 300,
    slidesPerView: 2,
    freeMode: true,
    loop: true,
    autoplay: true
  };

  constructor() {}

  ngOnInit() {}

  onClick( promocion ) {
    this.clickPost.emit( promocion );
  }

}
