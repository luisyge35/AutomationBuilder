function constructAddressSpace(server, addressSpace, eventObjects, done) {
    
    // Creamos constantes para algunos objetos y implificar la escritura
    const miopcua =coreServer.core.nodeOPCUA; 				        // Acceso a nodeopcua
    const LocalizedText = coreServer.core.nodeOPCUA.LocalizedText 	// Para simplificar textos localizados
    const namespace = addressSpace.getOwnNamespace()			    // Espacio de nombres

    
    const Variant = miopcua.Variant;
    const DataType = miopcua.DataType;
    const DataValue = miopcua.DataValue;
  
    var flexServerInternals = this;
    
    const rootFolder = addressSpace.findNode("RootFolder");

    node.warn('Espacio de direcciones gateway PI 1')
    
    // Uso de una variable local para mantener un valor sobre el que leer/escribir
    var fake=69.0
     //----------------------------------------------------------------------
    //**************CARPETILLAS*********************
  
    const Planta40 = namespace.addFolder(rootFolder, {
        "browseName": "Planta Industria 4.0"
      });
    
      const control_central = namespace.addFolder(Planta40, {
        "browseName": "Control Planta"
      });
    
      const stations = namespace.addFolder(Planta40, {
        "browseName": "Estaciones"
      });
    
    
    let rpi = namespace.addObject({
        browseName: 'RPi Gateway',
        description: 'Objeto que representa una RPi haciendo de gateway IoT',
        organizedBy: addressSpace.rootFolder.objects,
        notifierOf: addressSpace.rootFolder.objects.server
    })
    // AÃ±adimos el mÃ©todo
    const m1=namespace.addMethod(rpi,{
        browseName: "CalcSen",
        nodeID:"ns=1;s=CalcSen",
        inputArguments:[{
            name: "Angulo (radianes)",
            description: {text: "Angulo en radianes para el seno"},
            dataType: 'Double'
        }],
        outputArguments:[{
            name: "Seno",
            description: {text: "Valor del seno"},
            dataType: 'String'
        }]
    })
    
    // Y ahora lo atamos a una funciÃ³n
    m1.bindMethod(function(inputArguments,context,callback) {
        const angulo = inputArguments[0].value; // Valor del argumento
	    // Creamos un objeto para el resultado
        const callMethodResult = {
            statusCode: miopcua.StatusCodes.Good,
            outputArguments: [{
                    dataType: 'String',
                    value : 'OK'
            }]
        };

        callback(null,callMethodResult);
    });

     var prueba = 0;
    //
    //----------------------------------------------------------
    //
    //**************ALIMENTADOR DE BASES*********************
    const E_Bases = namespace.addObject({
      browseName: 'Alimentador de Bases',
      description: 'Estacion N1 de la planta',
      organizedBy: stations,
      notifierOf: addressSpace.rootFolder.objects.server
    })
  
    const I_xA0_Bases = namespace.addVariable({
      componentOf: E_Bases,
      "browseName": "I_xA0_Bases",
      "nodeId": "ns=1;s=1002",
      "dataType": DataType.Boolean,
      "value": {
        "get": function () {
          return new Variant({
            "dataType": DataType.Boolean,
            "value": flexServerInternals.sandboxFlowContext.get("I_xBase_Bases")
          });
        },
      }
    });
  
    const I_xA1_Bases = namespace.addVariable({
      componentOf: E_Bases,
      "browseName": "I_xA1_Bases",
      "nodeId": "ns=1;s=I_xA1_Bases",
      "dataType": DataType.Byte,
      "value": {
        "get": function () {
          return new Variant({
            "dataType": DataType.Byte,
            "value": prueba
          });
        },
        "set": function (variant) {
                  prueba = variant.value
                  return opcua.StatusCodes.Good
              }
      }
    });
    
    // AÃ±adimos el mÃ©todo
      const m2=namespace.addMethod(stations,{
          browseName: "CalcSen",
          nodeID:"ns=1;s=CalcSen",
          inputArguments:[{
              name: "Angulo (radianes)",
              description: {text: "Angulo en radianes para el seno"},
              dataType: 'Double'
          }],
          outputArguments:[{
              name: "Seno",
              description: {text: "Valor del seno"},
              dataType: 'Double'
          }]
      })
      
      // Y ahora lo atamos a una funciÃ³n
      m2.bindMethod(function(inputArguments,context,callback) {
          const angulo = inputArguments[0].value; // Valor del argumento
          // Creamos un objeto para el resultado
          const callMethodResult = {
              statusCode: miopcua.StatusCodes.Good,
              outputArguments: [{
                      dataType: 'Double',
                      value : Math.sin(angulo)
              }]
          };
  
          callback(null,callMethodResult);
      });
  
    //
    //------------------------------------------------------------------------------
    //
    // SISTEMA DE TRANSPORTE
    const Transporte = namespace.addObject({
      browseName: 'Sistema de Transporte',
      description: 'Sistema de transporte de la planta',
      organizedBy: stations,
      notifierOf: addressSpace.rootFolder.objects.server
    })
  
    const Driver = namespace.addObject({
      browseName: 'Driver',
      description: 'Driver del sistema de transporte',
      organizedBy: Transporte,
      notifierOf: addressSpace.rootFolder.objects.server
    })
    
    const Recoger=namespace.addMethod(Transporte,{
          browseName: "Recoger",
          nodeID:"ns=1;s=Recoger",
          inputArguments:[{
              name: "Estacion",
              description: {text: "Estacion donde se desea hacer la recogida"},
              dataType: DataType.Byte
          }],
          outputArguments:[{
              name: "Status",
              description: {text: "Resultado de la Operacion"},
              dataType: 'String'
          }]
      })
      
      // Y ahora lo atamos a una funciÃ³n
      Recoger.bindMethod(function(inputArguments,context,callback) {
          prueba = inputArguments[0].value;
          const callMethodResult2 = {
              statusCode: miopcua.StatusCodes.Good,
              outputArguments: [{
                      dataType: 'String',
                      value : 'OK'
              }]
          };
      
          callback(null,callMethodResult2);
      });
   
   done()
}