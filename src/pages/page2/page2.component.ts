import { Department } from './../../shared/models/department.model';
import { Component, OnInit } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';

// We use the gql tag to parse our query string into a query document
const departmentsQry = gql`
  query Departments {
    departments {
      dept_no
      dept_name
    }
  }
`;

@Component({
  selector: 'app-page-2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnInit {
  departments: Array<Department>;
  query: ApolloQueryObservable<Array<Department>>;

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.query = this.apollo.watchQuery<Array<Department>>({
      query: departmentsQry
    });

    this.query.subscribe(resp => {
      let data: Array<Department> = [].concat((<any>resp.data).departments);
      console.log(data);

      data = data.sort((a, b) => {
        if (a.dept_name < b.dept_name) {
          return -1;
        } else if (a.dept_name > b.dept_name) {
          return 1;
        } else {
          return 0;
        }
      });

      this.departments = data;
    });
  }

  requery() {
    this.query.refetch();
  }

}
