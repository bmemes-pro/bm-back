import configuration from '../config'
import { TargetAddress } from './entities/TargetAddress'
import { DataSource } from 'typeorm'

const initDBData = async (dataSource: DataSource): Promise<void> => {
   // initialize targetAddress
   const targetAddressRepository = dataSource.getRepository(TargetAddress)
   const addresses_count = await targetAddressRepository.count()

   if (addresses_count == 0) {
     const target_address = new TargetAddress()
     target_address.address = configuration.ton.target_address
     await targetAddressRepository.save(target_address)
   } 
}

export default initDBData
