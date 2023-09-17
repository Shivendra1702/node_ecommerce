ecomm app ---
             |
             |           
             |--->{models}->|------> (User)
             |              |        -name
             |              |        -email
             |              |        -password
             |              |        -photo {id,secure Url}
             |              |        -role
             |              |        -createdAt
             |              |        -resetPasswordToken
             |              |        -resetPasswordExpiry
             |              |
             |              |
             |              |--------------------------------->(order)
             |              |                                  -shippingInfo{}
             |              |----->(Product)                   -User
             |                    -name                        -paymentInfo{}
             |                    -price                       -taxInfo
             |                    -description                 -ShippingAmount
             |                    -photos[]                    -OrderStatus
             |                    -category                    -DeliveredAt
             |                    -brand                       -CreatedAt
             |                    -stock                       -orderItems = [{name,quantity,image,price,product}]                
             |                    -ratings
             |                    -NumOfReviews
             |                    -reviews{user,name,rating,comment}
             |                    -user
             |                    -createdAt
             |
             |
             |
             |
             |
             |--->{utils}---->-email/service
             |                -WhereClause
             |                 
             |                
             |
             |
             |
             |
