import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

export interface PhotonData {
  properties: {
    name?: string;
    street?: string;
    city?: string;
    country?: string;
    postcode?: string;
    [key: string]: any;
  };
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

@Injectable()
export class PhotonService {
  private readonly PHOTON_URL = 'https://photon.komoot.io/api';

  async searchAddress(query: string, limit: number = 5) {
    try {
      const url = new URL(this.PHOTON_URL);
      url.searchParams.append('q', query);
      url.searchParams.append('limit', limit.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new HttpException(`Photon API error: ${response.statusText}`, HttpStatus.BAD_GATEWAY,);

      const data = await response.json();

      return data.features.map((pd: PhotonData) => {
        const props = pd.properties;
        
        return {
          name: props.name,
          street: props.street,
          city: props.city,
          country: props.country,
          postcode: props.postcode,
          displayName: [props.name, props.street, props.city, props.country]
            .filter(Boolean)
            .join(', '),
          longitude: pd.geometry.coordinates[0],
          latitude: pd.geometry.coordinates[1],
        };
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error while fetching data from photon', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}