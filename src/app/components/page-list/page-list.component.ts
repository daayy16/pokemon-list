import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { PokemonModel } from 'src/app/model/pokemon.model';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {
  public pokemonList: Array<PokemonModel> = [];
  public temporaryList = [];
  public loading: boolean = false;
  public indexShow: number = 8;
  public showButton: boolean = true;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.loading = true;
    this.apollo
      .watchQuery({
        query: gql`
        {
            pokemon_v2_pokemon {
            name
            id
            pokemon_v2_pokemonsprites {
            sprites
           }
         }
      }
      `,
      })
      .valueChanges.subscribe((result: any) => {

        this.temporaryList = result.data.pokemon_v2_pokemon.map((pokemon: any) => {
          return Object.assign({}, pokemon, { images: JSON.parse(pokemon.pokemon_v2_pokemonsprites[0].sprites) })
        });

        this.pokemonList = this.temporaryList.map((pokemon: any) => {
          return {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.images.front_default
          }
        })

        this.loading = false;
      });
  }

  updateUrl(event: any, pokemon: any) {
    pokemon.image = null;
  }

  showMore() {
    this.indexShow += 4;

    if (this.indexShow >= this.pokemonList.length - 1) {
      this.showButton = false;
    }


  }

}
