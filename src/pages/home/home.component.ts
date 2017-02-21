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

const departmentAddQry = gql`
  mutation ($dept: DepartmentInput!) {
    insertUpdateDepartment (department: $dept) {
      dept_no
      dept_name
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  departmentSubscription: ApolloQueryObservable<any>;

  departments: Array<any>;
  dept_no = '';
  dept_name = '';

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.departmentSubscription = this.apollo.watchQuery({
      query: departmentsQry
    });

    this.departmentSubscription.subscribe(({data}) => {
      console.log('department data loaded');
      this.departments = (<any>data).departments;
    });
  }

  addDepartment() {
    if (this.dept_no && this.dept_name) {
      this.apollo.mutate({
        mutation: departmentAddQry,
        variables: {
          dept: {
            dept_no: this.dept_no,
            dept_name: this.dept_name
          }
        },
        updateQueries: {
          Departments: (prev, {mutationResult}: any) => {

            return {
              departments: [mutationResult.data.insertUpdateDepartment, ...(<any>prev).departments]
            };
          }
        }
      }).subscribe(
        ({ data }) => {
          console.log('got data', data);
        }, (err) => {
          console.log('there was an error sending the query', err);
        });

    }
  }

}
