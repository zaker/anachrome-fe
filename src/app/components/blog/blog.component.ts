import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

// We use the gql tag to parse our query string into a query document
const CurrentUserForProfile = gql`
  query  {
    blogs {
      title
      path
    }
  }
`;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html'
 })
 export class BlogComponent implements OnInit, OnDestroy {
  loading: boolean;
  currentBlog: any;
  blogTitle:string = "foofoo";

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: CurrentUserForProfile
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.currentBlog = data.currentBlog;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
