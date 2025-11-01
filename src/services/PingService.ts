import { host } from "@/api";

type GetPingServices = {serviceId: number, isReachable: boolean}[]

export default class PingService {
  async pingAllEnabledServices() {
    const request = await fetch(`${host}/api/ping/services`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    })
    const response = await request.json()

    return response as GetPingServices
  }
}
